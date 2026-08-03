import Badge from '@/components/ui/Badge';
import StarRating from '@/components/ui/StarRating';

interface Lesson {
  id: string;
  date: string;
  instructor: string;
  skills: string[];
  notes: string;
  rating: number;
}

interface LessonLogProps {
  lessons: Lesson[];
}

export default function LessonLog({ lessons }: LessonLogProps) {
  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />

      <div className="space-y-6">
        {lessons.map((lesson) => (
          <div key={lesson.id} className="relative pl-10">
            {/* Timeline dot */}
            <div className="absolute left-2.5 top-1.5 w-3 h-3 rounded-full bg-primary-500 ring-4 ring-white" />

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {lesson.date} - {lesson.instructor}
                  </p>
                </div>
                <StarRating rating={lesson.rating} size="sm" />
              </div>

              <div className="flex flex-wrap gap-1.5 mb-2">
                {lesson.skills.map((skill) => (
                  <Badge key={skill} variant="info">{skill}</Badge>
                ))}
              </div>

              <p className="text-sm text-gray-600">{lesson.notes}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
