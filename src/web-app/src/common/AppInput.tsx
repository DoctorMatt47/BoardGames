import { InputHTMLAttributes } from "react";

type Props = {
  disabled: boolean;
  [key: string]: unknown;
} & InputHTMLAttributes<HTMLInputElement>;

function AppInput({ disabled, ...restProps }: Props) {
  const _className = [
    "w-full bg-white bg-opacity-15 rounded p-1 lg:p-2",
    disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-opacity-30",
  ].join(" ");

  return (
    <input type="text" className={_className} placeholder="Type your message..." disabled={disabled} {...restProps} />
  );
}

export default AppInput;
