import { ExamQuestion } from '../types';

export const EXAM_PAPERS: Array<{
  id: string;
  title: string;
  year: string;
  durationMinutes: number;
  description: string;
  questions: ExamQuestion[];
}> = [
  {
    id: 'kntt_exam_2025_01',
    title: 'Đề Khảo Sát Toàn Diện Môn Toán THPT - Đề Số 01',
    year: 'Format Mới 2025',
    durationMinutes: 45,
    description: 'Chuẩn cấu trúc Bộ Giáo dục và Đào tạo: Phần I (4 câu trắc nghiệm), Phần II (2 câu đúng sai), Phần III (2 câu điền số).',
    questions: [
      // PHẦN I
      {
        id: 'ex_1',
        part: 'I',
        format: 'multiple_choice_4',
        difficulty: 'Nhận biết',
        content: 'Cho bất phương trình bậc nhất hai ẩn $x - 2y + 4 > 0$. Miền nghiệm của bất phương trình chứa điểm nào sau đây?',
        options: [
          { id: 'A', text: '$(0; 0)$' },
          { id: 'B', text: '$(0; 3)$' },
          { id: 'C', text: '$(-5; 0)$' },
          { id: 'D', text: '$(-4; 1)$' }
        ],
        correctAnswer: 'A',
        solution: 'Thay tọa độ $(0; 0)$ vào: $0 - 2(0) + 4 = 4 > 0$ (thỏa mãn). Vậy điểm $(0; 0)$ thuộc miền nghiệm.'
      },
      {
        id: 'ex_2',
        part: 'I',
        format: 'multiple_choice_4',
        difficulty: 'Thông hiểu',
        content: 'Cho cấp số nhân $(u_n)$ có số hạng đầu $u_1 = 2$ và công bội $q = 3$. Số hạng $u_4$ bằng:',
        options: [
          { id: 'A', text: '54' },
          { id: 'B', text: '18' },
          { id: 'C', text: '162' },
          { id: 'D', text: '24' }
        ],
        correctAnswer: 'A',
        solution: 'Áp dụng công thức $u_n = u_1 \\cdot q^{n-1} \\Rightarrow u_4 = 2 \\times 3^3 = 2 \\times 27 = 54$.'
      },
      {
        id: 'ex_3',
        part: 'I',
        format: 'multiple_choice_4',
        difficulty: 'Nhận biết',
        content: 'Đường tiệm cận ngang của đồ thị hàm số $y = \\frac{x - 1}{x + 1}$ là đường thẳng:',
        options: [
          { id: 'A', text: '$y = 1$' },
          { id: 'B', text: '$y = -1$' },
          { id: 'C', text: '$x = -1$' },
          { id: 'D', text: '$x = 1$' }
        ],
        correctAnswer: 'A',
        solution: 'Ta có $\\lim_{x \\to \\pm\\infty} \\frac{x - 1}{x + 1} = 1$, do đó đường tiệm cận ngang là $y = 1$.'
      },
      {
        id: 'ex_4',
        part: 'I',
        format: 'multiple_choice_4',
        difficulty: 'Thông hiểu',
        content: 'Trong không gian $Oxyz$, cho hai vectơ $\\vec{u} = (1; -2; 3)$ và $\\vec{v} = (2; 1; -1)$. Tích vô hướng $\\vec{u} \\cdot \\vec{v}$ bằng:',
        options: [
          { id: 'A', text: '$-3$' },
          { id: 'B', text: '$3$' },
          { id: 'C', text: '$7$' },
          { id: 'D', text: '$-1$' }
        ],
        correctAnswer: 'A',
        solution: 'Áp dụng công thức tích vô hướng trong không gian: $\\vec{u} \\cdot \\vec{v} = x_1 x_2 + y_1 y_2 + z_1 z_2 = 1(2) + (-2)(1) + 3(-1) = 2 - 2 - 3 = -3$.'
      },
      // PHẦN II
      {
        id: 'ex_5',
        part: 'II',
        format: 'true_false_4',
        difficulty: 'Vận dụng',
        content: 'Khảo sát mẫu số liệu điểm kiểm tra của 40 học sinh lớp 11 với bảng ghép nhóm sau:<br><div class="p-2 bg-slate-100 rounded-lg text-xs font-mono my-2 text-center">[4;6): 8 HS | [6;8): 20 HS | [8;10): 12 HS</div>Xét tính Đúng / Sai của các khẳng định sau:',
        subQuestions: [
          { id: 'a', statement: 'Nhóm chứa mốt là nhóm $[6; 8)$.', isCorrect: true },
          { id: 'b', statement: 'Trung vị của mẫu điểm thuộc nhóm $[4; 6)$.', isCorrect: false },
          { id: 'c', statement: 'Điểm trung bình của mẫu là $\\bar{x} = 7,2$.', isCorrect: true },
          { id: 'd', statement: 'Có ít nhất $80\\%$ số học sinh đạt điểm từ 6 trở lên.', isCorrect: true }
        ],
        solution: 'Ý a: Đúng vì nhóm $[6;8)$ có tần số 20 lớn nhất. Ý b: Sai vì $\\frac{n}{2} = 20 > 8$, trung vị thuộc nhóm $[6;8)$. Ý c: Đúng vì $\\bar{x} = \\frac{8(5) + 20(7) + 12(9)}{40} = \\frac{40 + 140 + 108}{40} = \\frac{288}{40} = 7,2$. Ý d: Đúng vì số học sinh từ 6 điểm trở lên là $20 + 12 = 32$, chiếm $\\frac{32}{40} = 80\\%$.'
      },
      {
        id: 'ex_6',
        part: 'II',
        format: 'true_false_4',
        difficulty: 'Vận dụng',
        content: 'Cho hàm số bậc ba $y = f(x) = x^3 - 3x + 2$. Khảo sát sự biến thiên và đồ thị của hàm số. Xét tính Đúng / Sai của các mệnh đề sau:',
        subQuestions: [
          { id: 'a', statement: 'Hàm số đồng biến trên các khoảng $(-\\infty; -1)$ và $(1; +\\infty)$.', isCorrect: true },
          { id: 'b', statement: 'Hàm số đạt cực đại tại $x = 1$.', isCorrect: false },
          { id: 'c', statement: 'Giá trị cực tiểu của hàm số bằng $0$.', isCorrect: true },
          { id: 'd', statement: 'Đồ thị hàm số có tâm đối xứng là điểm uốn $I(0; 2)$.', isCorrect: true }
        ],
        solution: 'Đạo hàm: $f\'(x) = 3x^2 - 3 = 0 \\Leftrightarrow x = \\pm 1$. Bảng biến thiên:<br><div class="p-2 bg-slate-100 rounded text-xs font-mono my-2 text-center">x: -∞ -------- -1 -------- 1 -------- +∞<br>y\': --- + --- 0 --- - --- 0 --- + ---<br>y: -∞ ↗ (CĐ: 4) ↘ (CT: 0) ↗ +∞</div>Từ BBT suy ra hàm số đạt cực đại tại $x = -1$ ($y_{\\text{CĐ}} = 4$), cực tiểu tại $x = 1$ ($y_{\\text{CT}} = 0$). Hàm số đồng biến trên $(-\\infty; -1)$ và $(1; +\\infty)$. Đạo hàm cấp hai $f\'\'(x) = 6x = 0 \\Leftrightarrow x = 0 \\Rightarrow y(0) = 2$, vậy tâm đối xứng của đồ thị là điểm uốn $I(0; 2)$.'
      },
      // PHẦN III
      {
        id: 'ex_7',
        part: 'III',
        format: 'short_answer',
        difficulty: 'Vận dụng cao',
        content: 'Một mảnh đất hình chữ nhật có chu vi bằng $40$ mét. Diện tích lớn nhất có thể có của mảnh đất đó bằng bao nhiêu mét vuông?',
        correctAnswer: '100',
        solution: 'Nửa chu vi là $20$ m. Gọi chiều rộng là $x$ ($0 < x < 20$) thì chiều dài là $20 - x$. Diện tích $S = x(20 - x) = -(x - 10)^2 + 100 \\le 100$. Dấu "=" xảy ra khi mảnh đất là hình vuông cạnh $10$ m, diện tích lớn nhất bằng $100\\text{ m}^2$.'
      },
      {
        id: 'ex_8',
        part: 'III',
        format: 'short_answer',
        difficulty: 'Thông hiểu',
        content: 'Cho cấp số cộng $(u_n)$ có số hạng đầu $u_1 = 5$ và công sai $d = 3$. Tính tổng $S_{10}$ của $10$ số hạng đầu tiên.',
        correctAnswer: '185',
        solution: 'Áp dụng công thức $S_n = \\frac{n[2u_1 + (n-1)d]}{2}$. Với $n=10$: $S_{10} = \\frac{10[2(5) + 9(3)]}{2} = 5 \\times (10 + 27) = 5 \\times 37 = 185$.'
      }
    ]
  }
];
