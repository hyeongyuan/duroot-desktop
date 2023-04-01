interface ButtonProps {
  label: string;
  onClick?: (event: MouseEvent & {
    currentTarget: HTMLButtonElement;
    target: Element;
  }) => void;
}

function Button(props: ButtonProps) {
  return (
    <button
      class="bg-[#0f0f0f98] rounded h-[34px] px-4"
      onClick={(e) => props.onClick?.(e)}
    >
      {props.label}
    </button>
  );
}

export default Button;
