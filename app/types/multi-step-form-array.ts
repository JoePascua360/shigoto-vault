export type MultiStepFormArray<T> = {
  element: React.ReactElement;
  title: {
    text: string;
    className: string;
  };
  contentClassName: string;
  fieldNameArray: Array<T>;
};
