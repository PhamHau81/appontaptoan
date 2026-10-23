import { GoogleGenAI } from '@google/genai';
import { Question, ExamQuestion, GradeNumber } from '../types';

export interface AIModelConfig {
  id: string;
  name: string;
  badge: string;
  description: string;
}

export const AI_MODELS: AIModelConfig[] = [
  {
    id: 'gemini-3-flash-preview',
    name: 'Gemini 3 Flash (Khuyên Dùng)',
    badge: 'Mặc định • Tốc độ cao',
    description: 'Tối ưu cho phản hồi nhanh, giải toán THPT và mẹo Casio tức thì.'
  },
  {
    id: 'gemini-3-pro-preview',
    name: 'Gemini 3 Pro',
    badge: 'Suy luận sâu',
    description: 'Mạnh mẽ trong việc phân tích các bài toán vận dụng cao và tối ưu hóa.'
  },
  {
    id: 'gemini-2.5-flash',
    name: 'Gemini 2.5 Flash',
    badge: 'Dự phòng ổn định',
    description: 'Model dự phòng tin cậy khi các model preview đạt ngưỡng hạn ngạch.'
  }
];

const FALLBACK_CHAIN = [
  'gemini-3-flash-preview',
  'gemini-3-pro-preview',
  'gemini-2.5-flash'
];

export const getStoredApiKey = (): string => {
  try {
    return localStorage.getItem('gemini_api_key') || '';
  } catch {
    return '';
  }
};

export const setStoredApiKey = (key: string): void => {
  try {
    localStorage.setItem('gemini_api_key', key.trim());
  } catch {
    // ignore
  }
};

export const getStoredModel = (): string => {
  try {
    return localStorage.getItem('gemini_selected_model') || 'gemini-3-flash-preview';
  } catch {
    return 'gemini-3-flash-preview';
  }
};

export const setStoredModel = (modelId: string): void => {
  try {
    localStorage.setItem('gemini_selected_model', modelId);
  } catch {
    // ignore
  }
};

interface CallAIOptions {
  prompt: string;
  systemInstruction?: string;
  onModelAttempt?: (modelName: string) => void;
}

/**
 * Gọi Gemini API với cơ chế tự động thử lại (Retry) và Fallback tuần tự theo AI_INSTRUCTIONS.md
 */
export async function callGeminiWithFallback(options: CallAIOptions): Promise<{ text: string; modelUsed: string }> {
  const apiKey = getStoredApiKey();
  if (!apiKey) {
    throw new Error('NO_API_KEY');
  }

  const preferredModel = getStoredModel();
  // Sắp xếp danh sách fallback bắt đầu từ model được người dùng chọn
  const candidateModels = [
    preferredModel,
    ...FALLBACK_CHAIN.filter((m) => m !== preferredModel)
  ];

  let lastError: unknown = null;

  for (const modelId of candidateModels) {
    try {
      if (options.onModelAttempt) {
        options.onModelAttempt(modelId);
      }

      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: modelId,
        contents: options.prompt,
        config: {
          systemInstruction: options.systemInstruction || 'Bạn là trợ lý AI Gia Sư Môn Toán THPT chuẩn sách Kết Nối Tri Thức. Bạn giải thích chi tiết, sư phạm, kèm công thức LaTeX ($...$, $$...$$), chỉ ra các bẫy thường gặp và hướng dẫn mẹo máy tính Casio fx-580VN X / 880BTG khi phù hợp.'
        }
      });

      const responseText = response.text();
      if (responseText) {
        return { text: responseText, modelUsed: modelId };
      }
    } catch (err: unknown) {
      console.warn(`Model ${modelId} thất bại:`, err);
      lastError = err;
      // Tiếp tục thử với model tiếp theo trong chuỗi fallback
    }
  }

  // Nếu tất cả model đều thất bại -> Báo lỗi chi tiết theo AI_INSTRUCTIONS.md
  const errMsg = lastError instanceof Error ? lastError.message : String(lastError);
  throw new Error(`Tất cả các model AI đều thất bại: ${errMsg}`);
}

/**
 * Nhờ AI giải thích chi tiết câu hỏi toán học
 */
export async function askAIExplainQuestion(
  q: Question,
  userAnswer?: string,
  onModelAttempt?: (modelName: string) => void
): Promise<{ text: string; modelUsed: string }> {
  let questionDetails = `ĐỀ BÀI: ${q.content}\n`;
  if (q.format === 'multiple_choice_4' && q.options) {
    questionDetails += 'CÁC LỰA CHỌN:\n';
    q.options.forEach((opt) => {
      questionDetails += `- [${opt.id}] ${opt.text}\n`;
    });
    questionDetails += `ĐÁP ÁN ĐÚNG: ${q.correctAnswer}\n`;
    if (userAnswer) {
      questionDetails += `HỌC SINH ĐÃ CHỌN: ${userAnswer} (${userAnswer === q.correctAnswer ? 'Đúng' : 'Chưa đúng'})\n`;
    }
  } else if (q.format === 'true_false_4' && q.subQuestions) {
    questionDetails += 'CÁC MỆNH ĐỀ:\n';
    q.subQuestions.forEach((sub) => {
      questionDetails += `- [${sub.id}] ${sub.statement} (Đáp án: ${sub.isCorrect ? 'ĐÚNG' : 'SAI'})\n`;
    });
  } else if (q.format === 'short_answer') {
    questionDetails += `ĐÁP ÁN ĐÚNG: ${q.correctAnswer}\n`;
    if (userAnswer) {
      questionDetails += `HỌC SINH ĐÃ TRẢ LỜI: ${userAnswer}\n`;
    }
  }

  if (q.solution) {
    questionDetails += `HƯỚNG DẪN GIẢI HIỆN CÓ: ${q.solution}\n`;
  }

  const prompt = `
Dưới đây là một câu hỏi môn Toán THPT theo chương trình Kết Nối Tri Thức:
${questionDetails}

Hãy đóng vai Thầy/Cô giáo dạy Toán ôn thi tốt nghiệp THPT, phân tích giúp học sinh:
1. **Phương pháp tư duy & Lời giải chi tiết**: Trình bày từng bước mạch lạc, dùng chuẩn công thức LaTeX ($...$ hoặc $$...$$) đặc biệt là vectơ (\\overrightarrow{AB}, \\vec{a}), bảng biến thiên nếu có.
2. **Cảnh báo lỗi sai / Bẫy đề thi**: Học sinh thường mắc sai lầm gì ở bài này?
3. **Mẹo Casio (nếu có)**: Hướng dẫn bấm máy tính Casio fx-580VN X hoặc fx-880BTG để kiểm tra nhanh.
4. **Lời khuyên ôn tập**: Khắc sâu kiến thức trọng tâm của dạng toán này.
`;

  return callGeminiWithFallback({
    prompt,
    onModelAttempt
  });
}



/**
 * Nhờ AI tạo một câu hỏi toán học tương tự cùng dạng
 */
export async function askAIGenerateSimilarQuestion(
  q: Question,
  onModelAttempt?: (modelName: string) => void
): Promise<{ text: string; modelUsed: string }> {
  const prompt = `
Hãy tạo 1 câu hỏi môn Toán THPT TƯƠNG TỰ VÀ CÙNG DẠNG với câu hỏi sau nhưng thay đổi số liệu, tình huống:
ĐỀ BÀI GỐC: ${q.content}
DẠNG: ${q.format} (Mức độ: ${q.difficulty})

Yêu cầu xuất ra cấu trúc rõ ràng:
- **Đề bài tương tự**: (dùng LaTeX $...$ cho công thức)
- **Các phương án** (nếu là trắc nghiệm) hoặc **Các mệnh đề Đúng/Sai**
- **Đáp án chính xác**
- **Lời giải tóm tắt**
`;

  return callGeminiWithFallback({
    prompt,
    onModelAttempt
  });
}

export interface AIExamConfig {
  grade: GradeNumber;
  chapterId: string;
  chapterName: string;
  lessonName?: string;
  durationMinutes: number;
  difficulty: 'Nhận biết' | 'Thông hiểu' | 'Vận dụng' | 'Vận dụng cao' | 'Hỗn hợp phân hóa (Đề thi chuẩn)';
  counts: {
    part1Count: number;
    part2Count: number;
    part3Count: number;
  };
  customPrompt?: string;
}

export interface GeneratedExam {
  id: string;
  title: string;
  subtitle: string;
  grade: GradeNumber;
  chapterId: string;
  lessonName?: string;
  durationMinutes: number;
  createdAt: string;
  questions: ExamQuestion[];
}

/**
 * Tự động tạo đề thi môn Toán theo yêu cầu từng chương, từng bài bằng AI Gemini
 */
export async function generateAIExam(
  config: AIExamConfig,
  onModelAttempt?: (modelName: string) => void
): Promise<{ exam: GeneratedExam; modelUsed: string }> {
  const lessonScope = config.lessonName && config.lessonName !== 'all'
    ? `- Trọng tâm bài học cụ thể: "${config.lessonName}"`
    : `- Phạm vi: Toàn bộ các bài học trong chương "${config.chapterName}"`;

  const prompt = `
Bạn là chuyên gia thẩm định và ra đề thi môn Toán THPT theo chương trình GDPT mới (Sách giáo khoa Kết Nối Tri Thức Với Cuộc Sống).
Hãy biên soạn một bộ đề thi kiểm tra theo đúng ma trận và yêu cầu sau:

THÔNG TIN BẮT BUỘC:
- Khối lớp: Lớp ${config.grade}
- Chương: ${config.chapterName}
${lessonScope}
- Thời gian làm bài: ${config.durationMinutes} phút
- Mức độ nhận thức: ${config.difficulty}
- Số lượng câu hỏi:
  + Phần I (Trắc nghiệm 4 lựa chọn, chỉ 1 đáp án đúng): ${config.counts.part1Count} câu
  + Phần II (Trắc nghiệm Đúng / Sai, mỗi câu có 4 ý a, b, c, d): ${config.counts.part2Count} câu
  + Phần III (Trả lời ngắn / Điền kết quả số): ${config.counts.part3Count} câu
${config.customPrompt ? `- Yêu cầu bổ sung đặc biệt: ${config.customPrompt}` : ''}

QUY TẮC TOÁN HỌC & LATEX:
1. Tất cả công thức toán, biến số, tọa độ, nửa khoảng đều phải đặt trong dấu LaTeX $...$ (inline) hoặc $$...$$ (display).
2. Ký hiệu vectơ dùng \\vec{a} hoặc \\overrightarrow{AB}.
3. Với mẫu số liệu ghép nhóm: Dùng chuẩn nửa khoảng $[a; b)$ với đầu mút rõ ràng, công thức trung vị $M_e$, mốt $M_o$, khoảng biến thiên $R = a_{k+1} - a_1$.
4. Phần II: Trường "subQuestions" phải có đủ 4 phần tử với id: 'a', 'b', 'c', 'd' và statement, isCorrect (true hoặc false).
5. Phần III: "correctAnswer" phải là một số nguyên hoặc số thập phân/phân số gọn (ví dụ: '12', '4.5', '3/4').
6. Mỗi câu phải có trường "solution" giải thích chi tiết từng bước.

ĐỊNH DẠNG ĐẦU RA BẮT BUỘC:
Chỉ trả về DUY NHẤT một chuỗi JSON hợp lệ không có giải thích mở đầu hay kết thúc, tuân theo schema:
{
  "title": "Đề Kiểm Tra Toán ${config.grade} - ${config.lessonName && config.lessonName !== 'all' ? config.lessonName : config.chapterName}",
  "subtitle": "Thời gian ${config.durationMinutes} phút • Khung chương trình Kết Nối Tri Thức",
  "questions": [
    {
      "id": "q1",
      "part": "I",
      "format": "multiple_choice_4",
      "difficulty": "Thông hiểu",
      "content": "Nội dung câu hỏi...",
      "options": [
        {"id": "A", "text": "Phương án A"},
        {"id": "B", "text": "Phương án B"},
        {"id": "C", "text": "Phương án C"},
        {"id": "D", "text": "Phương án D"}
      ],
      "correctAnswer": "A",
      "solution": "Lời giải chi tiết..."
    },
    {
      "id": "q2",
      "part": "II",
      "format": "true_false_4",
      "difficulty": "Vận dụng",
      "content": "Nội dung câu hỏi đúng sai...",
      "subQuestions": [
        {"id": "a", "statement": "Mệnh đề a...", "isCorrect": true},
        {"id": "b", "statement": "Mệnh đề b...", "isCorrect": false},
        {"id": "c", "statement": "Mệnh đề c...", "isCorrect": true},
        {"id": "d", "statement": "Mệnh đề d...", "isCorrect": false}
      ],
      "solution": "Lời giải chi tiết..."
    },
    {
      "id": "q3",
      "part": "III",
      "format": "short_answer",
      "difficulty": "Vận dụng",
      "content": "Nội dung câu hỏi điền số...",
      "correctAnswer": "12",
      "solution": "Lời giải chi tiết..."
    }
  ]
}
`;

  const { text, modelUsed } = await callGeminiWithFallback({
    prompt,
    systemInstruction: 'Bạn là chuyên gia soạn thảo đề thi môn Toán THPT Kết Nối Tri Thức. Bạn CHỈ trả về dữ liệu định dạng JSON chuẩn không bọc thêm bất kỳ lời nói chuyện nào.',
    onModelAttempt
  });

  let cleanJson = text.trim();
  if (cleanJson.startsWith('```')) {
    cleanJson = cleanJson.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  }

  let parsed: any;
  try {
    parsed = JSON.parse(cleanJson);
  } catch (parseErr) {
    const firstBrace = cleanJson.indexOf('{');
    const lastBrace = cleanJson.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      const extracted = cleanJson.substring(firstBrace, lastBrace + 1);
      parsed = JSON.parse(extracted);
    } else {
      throw new Error(`Dữ liệu đề thi do AI trả về không đúng định dạng JSON: ${String(parseErr)}`);
    }
  }

  const generatedExam: GeneratedExam = {
    id: `ai_exam_${Date.now()}`,
    title: parsed.title || `Đề Kiểm Tra Toán ${config.grade} - ${config.chapterName}`,
    subtitle: parsed.subtitle || `Thời gian: ${config.durationMinutes} phút • Soạn bởi AI KNTT`,
    grade: config.grade,
    chapterId: config.chapterId,
    lessonName: config.lessonName,
    durationMinutes: config.durationMinutes,
    createdAt: new Date().toLocaleString('vi-VN'),
    questions: (parsed.questions || []).map((q: any, idx: number) => ({
      id: q.id || `ai_q_${idx + 1}`,
      part: q.part || (q.format === 'multiple_choice_4' ? 'I' : q.format === 'true_false_4' ? 'II' : 'III'),
      format: q.format || 'multiple_choice_4',
      difficulty: q.difficulty || 'Thông hiểu',
      content: q.content || '',
      options: q.options,
      subQuestions: q.subQuestions,
      correctAnswer: q.correctAnswer,
      solution: q.solution
    }))
  };

  return {
    exam: generatedExam,
    modelUsed
  };
}


