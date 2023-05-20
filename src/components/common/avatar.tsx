interface AvatarProps {
  size: number;
  imageUrl: string;
  alt?: string;
}

export function Avatar(props: AvatarProps) {
  return (
    <img
      style={{
        width: `${props.size}px`,
        height: `${props.size}px`,
      }}
      class="rounded-full"
      src={props.imageUrl}
      alt={props.alt || 'avatar'}
    />
  );
}
