import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';
import { Label } from '@/components/common/label';

const getProfileUrl = (userId: number, size = 40) => `https://avatars.githubusercontent.com/u/${userId}?s=${size}&v=4`;

interface PullsItemProps {
  title: string;
  titleUrl: string;
  subtitle: string;
  subtitleUrl: string;
  labels: {
    name: string;
    color: string;
  }[];
  user: {
    id: number;
    login: string;
  };
  createdAt: string;
}

export function PullsItem({ title, titleUrl, subtitle, subtitleUrl, labels, user, createdAt }: PullsItemProps) {
  return (
    <li className="flex flex-col px-4 py-2">
      <div className="flex items-center">
        <a
          className="text-[#768390] text-xs leading-5 line-clamp-1 break-all hover:underline hover:underline-offset-1 pr-1"
          href={subtitleUrl}
          target="_blank"
        >
          {subtitle}
        </a>
      </div>
      <div className={labels.length > 0 ? 'mb-1' : ''}>
        <a
          className="font-medium text-sm hover:text-[#539bf5] leading-6 line-clamp-3 break-all"
          href={titleUrl}
          target="_blank"
        >
          {title}
        </a>
      </div>
      <span className={`${labels.length > 0 ? 'mb-1' : ''} flex flex-wrap space-x-1 gap-1`}> 
        {labels.map(({ name, color }) => (
          <Label key={name} name={name} color={color} />
        ))}
      </span>
      <div className="flex items-center text-[#768390]">
        <span className="flex items-center">
          <img className="w-4 h-4 rounded-full mr-2" src={getProfileUrl(user.id, 32)} alt="avatar" />
          <p className="text-[#adbac7] text-[10px] font-medium leading-5 line-clamp-1 break-all">
            {user.login}
          </p>
        </span>
        <span className="mx-1">·</span>
        <span>
          <p className="text-[10px] font-medium leading-5 line-clamp-1 break-all">
            {formatDistanceToNow(new Date(createdAt))}
          </p>
        </span>
      </div>
    </li>
  );
}
