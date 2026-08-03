import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

interface BookingCardProps {
  instructorName: string;
  instructorAvatar?: string | null;
  date: string;
  time: string;
  duration: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  price: number;
  showCancel?: boolean;
  showReview?: boolean;
  onCancel?: () => void;
  onReview?: () => void;
}

export default function BookingCard({
  instructorName,
  instructorAvatar,
  date,
  time,
  duration,
  status,
  price,
  showCancel = false,
  showReview = false,
  onCancel,
  onReview,
}: BookingCardProps) {
  const statusVariant = {
    confirmed: 'success' as const,
    pending: 'warning' as const,
    completed: 'info' as const,
    cancelled: 'danger' as const,
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center gap-4">
        <Avatar name={instructorName} src={instructorAvatar} size="md" />
        <div className="flex-1">
          <p className="font-medium text-gray-900">{instructorName}</p>
          <p className="text-sm text-gray-500">
            {date} at {time} - {duration}
          </p>
        </div>
        <div className="text-right">
          <Badge variant={statusVariant[status]}>{status}</Badge>
          <p className="text-sm font-medium text-gray-900 mt-1">&pound;{price}</p>
        </div>
      </div>
      {(showCancel || showReview) && (
        <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
          {showCancel && (
            <Button size="sm" variant="danger" onClick={onCancel}>
              Cancel Booking
            </Button>
          )}
          {showReview && (
            <Button size="sm" variant="outline" onClick={onReview}>
              Leave Review
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
