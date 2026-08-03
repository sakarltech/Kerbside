'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import StarRating from '@/components/ui/StarRating';

interface ReviewFormProps {
  bookingId: string;
  onSubmit?: (data: { rating: number; comment: string }) => void;
}

export default function ReviewForm({ bookingId, onSubmit }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;

    setLoading(true);
    try {
      await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId, rating, comment }),
      });
      onSubmit?.({ rating, comment });
    } catch (error) {
      console.error('Failed to submit review:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Rating
        </label>
        <StarRating rating={rating} interactive onChange={setRating} size="lg" />
        {rating === 0 && (
          <p className="text-xs text-gray-500 mt-1">Click a star to rate</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Comment
        </label>
        <textarea
          className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          rows={4}
          placeholder="Share your experience with this instructor..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>

      <Button type="submit" loading={loading} disabled={rating === 0}>
        Submit Review
      </Button>
    </form>
  );
}
