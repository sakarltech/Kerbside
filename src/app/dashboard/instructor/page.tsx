import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import StarRating from '@/components/ui/StarRating';
import ProgressBar from '@/components/ui/ProgressBar';
import { Calendar, PoundSterling, TrendingUp, Star } from 'lucide-react';

export default function InstructorDashboardPage() {
  // Placeholder data - will be fetched from API in production
  const stats = {
    weeklyEarnings: 480,
    monthlyEarnings: 1920,
    upcomingBookings: 5,
    profileCompletion: 85,
  };

  const upcomingBookings = [
    { id: '1', student: 'Sarah Johnson', date: '2024-02-15', time: '09:00', duration: '1 hour', status: 'confirmed' },
    { id: '2', student: 'Mike Chen', date: '2024-02-15', time: '11:00', duration: '1.5 hours', status: 'confirmed' },
    { id: '3', student: 'Emma Williams', date: '2024-02-16', time: '14:00', duration: '1 hour', status: 'pending' },
  ];

  const recentReviews = [
    { id: '1', student: 'Sarah Johnson', rating: 5, comment: 'Excellent instructor! Very patient and clear explanations.', date: '2024-02-10' },
    { id: '2', student: 'Tom Brown', rating: 4, comment: 'Good lesson, helped me with parallel parking.', date: '2024-02-08' },
    { id: '3', student: 'Lisa Park', rating: 5, comment: 'Brilliant! Passed first time thanks to the great teaching.', date: '2024-02-05' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Instructor Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here is your overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <PoundSterling className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">This Week</p>
              <p className="text-xl font-bold text-gray-900">&pound;{stats.weeklyEarnings}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">This Month</p>
              <p className="text-xl font-bold text-gray-900">&pound;{stats.monthlyEarnings}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Upcoming</p>
              <p className="text-xl font-bold text-gray-900">{stats.upcomingBookings}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Star className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Profile</p>
              <p className="text-xl font-bold text-gray-900">{stats.profileCompletion}%</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Profile Completion */}
      <Card header={<h3 className="font-semibold text-gray-900">Profile Completion</h3>}>
        <ProgressBar value={stats.profileCompletion} label="Complete your profile to attract more students" />
      </Card>

      {/* Upcoming Bookings */}
      <Card header={<h3 className="font-semibold text-gray-900">Upcoming Bookings</h3>}>
        <div className="divide-y divide-gray-100">
          {upcomingBookings.map((booking) => (
            <div key={booking.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
              <div>
                <p className="font-medium text-gray-900">{booking.student}</p>
                <p className="text-sm text-gray-500">{booking.date} at {booking.time} - {booking.duration}</p>
              </div>
              <Badge variant={booking.status === 'confirmed' ? 'success' : 'warning'}>
                {booking.status}
              </Badge>
            </div>
          ))}
        </div>
      </Card>

      {/* Recent Reviews */}
      <Card header={<h3 className="font-semibold text-gray-900">Recent Reviews</h3>}>
        <div className="divide-y divide-gray-100">
          {recentReviews.map((review) => (
            <div key={review.id} className="py-3 first:pt-0 last:pb-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-gray-900 text-sm">{review.student}</span>
                <StarRating rating={review.rating} size="sm" />
              </div>
              <p className="text-sm text-gray-600">{review.comment}</p>
              <p className="text-xs text-gray-400 mt-1">{review.date}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
