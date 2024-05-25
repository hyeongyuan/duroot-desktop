export type Label = {
  name: string;
  color: string;
}

interface LabelProps extends Label {}

export function Label({ name, color }: LabelProps) {
  return (
    <a
      className="text-xs leading-[18px] rounded-full px-[7px] border border-transparent"
      style={{
        backgroundColor: `#${color}2e`,
        borderColor: `#${color}4d`,
        color: `#${color}`,
      }}
    >
      {name}
    </a>
  );
}
