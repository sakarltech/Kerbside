import Link from 'next/link';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import { CheckCircle } from 'lucide-react';

interface MatchCardProps {
  id: string;
  name: string;
  score: number;
  hourlyRate: number;
  matchFactors: string[];
  avatar: string | null;
}

export default function MatchCard({
  id,
  name,
  score,
  hourlyRate,
  matchFactors,
  avatar,
}: MatchCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <Avatar name={name} src={avatar} size="lg" />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{name}</h3>
          <p className="text-sm text-gray-500">&pound;{hourlyRate}/hr</p>
        </div>
        {/* Score circle */}
        <div className="flex-shrink-0 w-12 h-12 rounded-full border-4 border-primary-500 flex items-center justify-center">
          <span className="text-sm font-bold text-primary-600">{score}%</span>
        </div>
      </div>

      {/* Match factors */}
      <div className="mt-4 space-y-1.5">
        {matchFactors.map((factor) => (
          <div key={factor} className="flex items-center gap-2 text-sm">
            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
            <span className="text-gray-600">{factor}</span>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="mt-4 flex gap-2">
        <Link href={`/instructors/${id}`} className="flex-1">
          <Button variant="outline" size="sm" fullWidth>
            View Profile
          </Button>
        </Link>
        <Link href={`/booking/${id}`} className="flex-1">
          <Button variant="primary" size="sm" fullWidth>
            Book Now
          </Button>
        </Link>
      </div>
    </div>
  );
}
