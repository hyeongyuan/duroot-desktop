import { useQuery } from '@tanstack/react-query';
import { Label } from '@/components/common/label';
import { ApprovedMark } from '@/components/common/approved-mark';
import { fetchReviewCount } from '@/apis/github';
import { useAuthStore } from '@/stores/auth';
import { useTokenStore } from '@/stores/token';

interface MyPullsItemProps {
  title: string;
  titleUrl: string;
  subtitle: string;
  subtitleUrl: string;
  labels: {
    name: string;
    color: string;
  }[];
  pullRequestUrl: string;
  caption?: string;
}

export function MyPullsItem({ title, titleUrl, subtitle, subtitleUrl, labels, pullRequestUrl, caption }: MyPullsItemProps) {
  const { data: token } = useTokenStore();
  const { data: auth } = useAuthStore();

  const { data: reviewCount } = useQuery({
    queryKey: ['my-pulls', pullRequestUrl, auth?.login],
    queryFn: async () => {
      if (!token || !auth) {
        return;
      }
      return await fetchReviewCount(token, pullRequestUrl, auth.login);
    }
  });

  const allApproved = reviewCount && reviewCount.approved === reviewCount.total;

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
        {allApproved && <ApprovedMark />}
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
      <span className="flex flex-wrap gap-1">
        {labels.map(({ name, color }) => (
          <Label key={name} name={name} color={color} />
        ))}
      </span>
      {caption && (
        <p className="text-[#768390] text-[10px] leading-5 line-clamp-1 break-all mt-1">
          {caption}
        </p>
      )}
    </li>
  );
}
