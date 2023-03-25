
interface InputProps {
  type?: string;
  value?: string;
  onChange?: (e: Event & {
    currentTarget: HTMLInputElement;
    target: Element;
  }) => void;
}

function Input(props: InputProps) {
  return (
    <input
      class="bg-white text-[#0f0f0f] px-2 py-1 rounded-sm"
      {...props}
    />
  )
}

export default Input;
