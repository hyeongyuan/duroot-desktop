import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export function Input({ value, placeholder, onChange }: InputProps) {
  return (
    <div className="bg-[#1c2128] text-[#adbac7] text-sm border border-[#444c56] rounded h-[33px] px-2">
      <input
        type="text"
        className="bg-transparent w-full h-full"
        value={value}
        placeholder={placeholder}
        onChange={onChange}
      />
    </div>
  );
}
