export interface ISelectOptionProps {
    select: {
      question: string;
      options: Array<{
        label: string;
        value: string;
      }>;
    };
    onOptionSelect: (value: string) => void;
  }