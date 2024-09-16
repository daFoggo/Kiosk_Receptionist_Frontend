export interface ChatMockData {
  id: number;
  initialMessage: string;
  video_path: string;
  select: SelectOptionProps;
  response: {
    [key: string]: string;
  };
  response_path: {
    [key: string]: string;
  };
}

export interface SelectOptionProps {
  question: string;
  video_path: string;
  options: Option[];
}

export interface Option {
  label: string;
  value: string;
  extraFlow?: string;
}
