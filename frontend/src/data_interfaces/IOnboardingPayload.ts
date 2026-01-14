export default interface OnboardingPayload {
  age?: number;
  experience_years: string;
  learning_style: 'visual' | 'reading' | 'hands_on';
  selected_skills: string[];
  goals: string[];
  daily_goal_minutes: number;
  test_results: {
    question_id: string;
    answer: string;
    is_correct: boolean;
    time_spent: number;
    used_hint: boolean;
  }[];
}
