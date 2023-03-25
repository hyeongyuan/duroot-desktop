
interface ButtonProps {
  label: string;
  onClick?: () => void;
}

function Button({label, onClick}: ButtonProps) {
  return (
    <button class="bg-[#0f0f0f98]" onClick={onClick}>
      {label}
    </button>
  );
}

export default Button;
