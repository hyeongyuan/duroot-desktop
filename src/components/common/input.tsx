interface InputProps {
  value: string;
  placeholder?: string;
  onInput: (event: InputEvent & {
    currentTarget: HTMLInputElement;
    target: HTMLInputElement;
  }) => void;
}

function Input(props: InputProps) {
  return (
    <div class="bg-[#1c2128] text-[#adbac7] text-sm border border-[#444c56] rounded h-[32px] px-2">
      <input
        type="text"
        class="bg-transparent w-full h-full"
        value={props.value}
        placeholder={props.placeholder}
        onInput={(e) => props.onInput(e)}
      />
    </div>
  );
}

export default Input;
