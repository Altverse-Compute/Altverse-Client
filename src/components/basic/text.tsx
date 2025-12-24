interface Props {
  placeholder: string;
  value?: string;
  onInput: (value: string) => void;
  min?: number;
  max?: number;
  type?: "text" | "number" | "password";
  defaultValue?: string;
}

export function TextField(props: Props) {
  return (
    <input
      type={props.type ?? "text"}
      className={"p-0.5 bg-(--window-bg) border-2 text-2xl rounded-xl"}
      value={props.value}
      placeholder={props.placeholder}
      onInput={(event) => props.onInput(event.currentTarget.value)}
      defaultValue={props.defaultValue}
      minLength={props.min}
      maxLength={props.max}
      min={props.min}
      max={props.max}
    />
  );
}
