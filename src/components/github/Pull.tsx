interface PullProps {
  title: string;
  repo: string;
  owner: string;
  user: string;
}

function Pull (props: PullProps) {
  return (
    <li class="flex flex-col px-4 py-2 cursor-pointer">
      <p class="flex align-center font-normal pr-1 text-[#768390] text-sm leading-5 line-clamp-1 break-all">
        {`${props.owner} / ${props.repo}`}
      </p>
      <h1 class="flex align-center font-medium text-base leading-6 line-clamp-3">
        {props.title}
      </h1>
    </li>
  );
}

export default Pull;
