export enum ExamType {
  NEET = 'NEET',
  JEE = 'JEE',
}

export enum Subject {
  PHYSICS = 'Physics',
  CHEMISTRY = 'Chemistry',
  BIOLOGY = 'Biology',
  MATHEMATICS = 'Mathematics',
}

export enum Difficulty {
  EASY = 'Easy',
  MEDIUM = 'Medium',
  HARD = 'Hard',
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface TestConfig {
  examType: ExamType;
  subject: Subject;
  classLevel: '11' | '12';
  chapter: string;
  topic: string;
  difficulty: Difficulty;
  questionCount: number;
}

export interface TestSession {
  config: TestConfig;
  questions: Question[];
  userAnswers: Record<number, number>; // questionIndex -> optionIndex
  startTime: number;
  isSubmitted: boolean;
}
