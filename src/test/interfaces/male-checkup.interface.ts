export interface MaleCheckupAnswer {
  id: string;
  answer: string | { weight: string; height: string };
}

export interface MaleCheckupRecommendations {
  basicTests: string[];
  additionalTests: string[];
  consultations: string[];
  measurements: string[];
  bmi?: {
    value: number;
    category: string;
  };
}
