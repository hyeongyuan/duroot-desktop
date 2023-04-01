import formatDistanceToNow from 'date-fns/formatDistanceToNow';

interface PullProps {
  title: string;
  repo: string;
  owner: string;
  user: string;
  createdAt: string;
}

function Pull (props: PullProps) {
  return (
    <li class="flex px-4 py-2 cursor-pointer hover:bg-[#2d333b]">
      <div class="grow-[95] basis-0">
        <p class="flex align-center font-normal pr-1 text-[#768390] text-sm leading-5 line-clamp-1 break-all">
          {`${props.owner} / ${props.repo}`}
        </p>
        <h1 class="flex align-center font-medium text-base leading-6 line-clamp-3">
          {props.title}
        </h1>
      </div>
      <div class="grow-[5] font-normal text-[#768390] text-sm leading-5">
        {formatDistanceToNow(new Date(props.createdAt))}
      </div>
    </li>
  );
}

export default Pull;
