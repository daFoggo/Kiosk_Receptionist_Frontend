export interface IChatMockData {
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

export interface ISelectOptionProps {
  question: string;
  video_path: string;
  options: Option[];
}

export interface IOption {
  label: string;
  value: string;
  extraFlow?: string;
}
