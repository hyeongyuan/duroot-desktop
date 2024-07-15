interface RoundButtonProps {
  label: string;
  onClick?: (event: React.MouseEvent) => void;
}

export function RoundButton({ label, onClick }: RoundButtonProps) {
  return (
    <button
      className="font-medium text-xs text-[#adbac7] leading-[16px] bg-[#373e47] hover:bg-[#3d444e] border border-[#444c56] px-[8px] py-[4px] rounded-full"
      onClick={onClick}
    >
      {label}
    </button>
  );
}
