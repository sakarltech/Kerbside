import Avatar from '@/components/ui/Avatar';
import StarRating from '@/components/ui/StarRating';

interface ReviewCardProps {
  studentName: string;
  studentAvatar?: string | null;
  rating: number;
  comment: string;
  date: string;
}

export default function ReviewCard({
  studentName,
  studentAvatar,
  rating,
  comment,
  date,
}: ReviewCardProps) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <Avatar name={studentName} src={studentAvatar} size="sm" />
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900">{studentName}</p>
          <div className="flex items-center gap-2">
            <StarRating rating={rating} size="sm" />
            <span className="text-xs text-gray-400">{date}</span>
          </div>
        </div>
      </div>
      <p className="text-sm text-gray-600 ml-11">{comment}</p>
    </div>
  );
}
