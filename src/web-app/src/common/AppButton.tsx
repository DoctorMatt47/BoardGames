type Props = {
  text: string;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  [key: string]: unknown;
};

function AppButton({ className, onClick, text, disabled, ...restProps }: Props) {
  const _className = [
    "w-full text-center p-1 lg:p-2 rounded bg-white bg-opacity-20",
    disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-opacity-30",
    className,
  ].join(" ");

  return (
    <button className={_className} onClick={onClick} disabled={disabled} {...restProps}>
      {text}
    </button>
  );
}

export default AppButton;
