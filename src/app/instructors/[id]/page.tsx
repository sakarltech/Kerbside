import Link from 'next/link';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Avatar from '@/components/ui/Avatar';
import StarRating from '@/components/ui/StarRating';
import ReviewCard from '@/components/reviews/ReviewCard';
import Card from '@/components/ui/Card';

// In production this would fetch from the database
const INSTRUCTOR = {
  id: '1',
  name: 'James Wilson',
  photo: null,
  rating: 4.8,
  totalReviews: 45,
  bio: 'I have been teaching driving for 10 years and love helping nervous learners build confidence on the road. My approach is patient and structured, ensuring you feel comfortable at every stage of your learning journey.',
  specialisms: ['Nervous beginners', 'Motorway driving', 'Pass Plus'],
  teachingStyle: 'Patient & Calm',
  carType: 'Hatchback (Manual)',
  languages: ['English', 'Polish'],
  anxietyFriendly: true,
  passRate: 87,
  hourlyRate: 35,
  reviews: [
    { id: '1', studentName: 'Sarah Johnson', rating: 5, comment: 'Brilliant instructor! So patient and helped me pass first time.', date: '2024-02-10' },
    { id: '2', studentName: 'Tom Brown', rating: 5, comment: 'Really helped me overcome my fear of roundabouts. Highly recommend!', date: '2024-02-05' },
    { id: '3', studentName: 'Lisa Park', rating: 4, comment: 'Great teaching style, very clear instructions. Booked more lessons.', date: '2024-01-28' },
  ],
};

export default function InstructorProfilePage() {
  const instructor = INSTRUCTOR;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <Card className="mb-6">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <Avatar name={instructor.name} src={instructor.photo} size="lg" className="w-24 h-24 text-2xl" />
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{instructor.name}</h1>
                  <div className="flex items-center gap-2 mt-1">
                    <StarRating rating={Math.round(instructor.rating)} size="sm" />
                    <span className="text-sm text-gray-600">
                      {instructor.rating} ({instructor.totalReviews} reviews)
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary-600">&pound;{instructor.hourlyRate}/hr</p>
                  <p className="text-sm text-gray-500">Pass rate: {instructor.passRate}%</p>
                </div>
              </div>
              <p className="text-gray-600 mt-4">{instructor.bio}</p>
            </div>
          </div>
        </Card>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Details */}
          <div className="md:col-span-2 space-y-6">
            {/* Specialisms */}
            <Card header={<h3 className="font-semibold text-gray-900">Specialisms</h3>}>
              <div className="flex flex-wrap gap-2">
                {instructor.specialisms.map((spec) => (
                  <Badge key={spec} variant="success">{spec}</Badge>
                ))}
              </div>
            </Card>

            {/* Details */}
            <Card header={<h3 className="font-semibold text-gray-900">Details</h3>}>
              <dl className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="text-gray-500">Teaching Style</dt>
                  <dd className="font-medium text-gray-900">{instructor.teachingStyle}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Car Type</dt>
                  <dd className="font-medium text-gray-900">{instructor.carType}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Languages</dt>
                  <dd className="font-medium text-gray-900">{instructor.languages.join(', ')}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Anxiety Friendly</dt>
                  <dd>
                    {instructor.anxietyFriendly ? (
                      <Badge variant="success">Yes</Badge>
                    ) : (
                      <Badge variant="default">No</Badge>
                    )}
                  </dd>
                </div>
              </dl>
            </Card>

            {/* Reviews */}
            <Card header={<h3 className="font-semibold text-gray-900">Reviews</h3>}>
              <div className="divide-y divide-gray-100">
                {instructor.reviews.map((review) => (
                  <div key={review.id} className="py-4 first:pt-0 last:pb-0">
                    <ReviewCard
                      studentName={review.studentName}
                      rating={review.rating}
                      comment={review.comment}
                      date={review.date}
                    />
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar CTA */}
          <div>
            <div className="sticky top-24">
              <Card>
                <div className="text-center space-y-4">
                  <p className="text-2xl font-bold text-gray-900">&pound;{instructor.hourlyRate}/hr</p>
                  <Link href={`/booking/${instructor.id}`}>
                    <Button fullWidth size="lg">Book This Instructor</Button>
                  </Link>
                  <p className="text-xs text-gray-500">
                    Free cancellation up to 24 hours before
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
