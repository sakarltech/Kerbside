import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Avatar from '@/components/ui/Avatar';
import { Calendar, BarChart3, Users, MessageSquare } from 'lucide-react';

export default function StudentDashboardPage() {
  const nextLesson = {
    instructor: 'James Wilson',
    date: '2024-02-15',
    time: '10:00',
    duration: '1 hour',
    location: 'Home pickup - SW1A 1AA',
  };

  const topMatches = [
    { id: '1', name: 'James Wilson', score: 95, speciality: 'Nervous beginners' },
    { id: '2', name: 'Sarah Miller', score: 88, speciality: 'Motorway driving' },
    { id: '3', name: 'David Lee', score: 82, speciality: 'Pass Plus' },
  ];

  const progressSummary = {
    skillsLearned: 12,
    totalSkills: 20,
    lastLessonDate: '2024-02-12',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here is your learning overview.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Calendar className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Next Lesson</p>
              <p className="font-semibold text-gray-900">{nextLesson.date}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Skills Progress</p>
              <p className="font-semibold text-gray-900">{progressSummary.skillsLearned}/{progressSummary.totalSkills}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Top Match</p>
              <p className="font-semibold text-gray-900">{topMatches[0].score}%</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <MessageSquare className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Messages</p>
              <p className="font-semibold text-gray-900">2 unread</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Next Lesson */}
      <Card header={<h3 className="font-semibold text-gray-900">Next Lesson</h3>}>
        <div className="flex items-center gap-4">
          <Avatar name={nextLesson.instructor} size="lg" />
          <div>
            <p className="font-medium text-gray-900">{nextLesson.instructor}</p>
            <p className="text-sm text-gray-600">
              {nextLesson.date} at {nextLesson.time} - {nextLesson.duration}
            </p>
            <p className="text-sm text-gray-500">{nextLesson.location}</p>
          </div>
        </div>
      </Card>

      {/* Top Matches */}
      <Card header={<h3 className="font-semibold text-gray-900">Top Matched Instructors</h3>}>
        <div className="divide-y divide-gray-100">
          {topMatches.map((match) => (
            <div key={match.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
              <div className="flex items-center gap-3">
                <Avatar name={match.name} />
                <div>
                  <p className="font-medium text-gray-900">{match.name}</p>
                  <p className="text-sm text-gray-500">{match.speciality}</p>
                </div>
              </div>
              <Badge variant="success">{match.score}% match</Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
