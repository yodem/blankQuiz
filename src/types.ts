export interface Choice {
  [key: string]: string;
}

export interface Question {
  question: string;
  choices: Choice;
  correct_answer: string;
}
