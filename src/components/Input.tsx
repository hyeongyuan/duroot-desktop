
interface InputProps {
  type?: string;
  value?: string;
  onChange?: (e: Event & {
    currentTarget: HTMLInputElement;
    target: Element;
  }) => void;
  message?: string;
}

function Input(props: InputProps) {
  return (
    <div>
      <input
        type={props.type}
        class="bg-white text-[#0f0f0f] px-2 py-1 rounded-sm"
        autocomplete="off"
        autocapitalize="off"
        value={props.value}
        onChange={props.onChange}
      />
      <p>{props.message}</p>
    </div>
  )
}

export default Input;
