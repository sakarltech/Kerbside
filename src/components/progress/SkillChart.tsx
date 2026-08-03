import ProgressBar from '@/components/ui/ProgressBar';

interface Skill {
  name: string;
  level: number;
  maxLevel: number;
}

interface SkillChartProps {
  skills: Skill[];
}

export default function SkillChart({ skills }: SkillChartProps) {
  return (
    <div className="space-y-4">
      {skills.map((skill) => {
        const percentage = (skill.level / skill.maxLevel) * 100;
        const variant =
          percentage >= 80
            ? ('success' as const)
            : percentage >= 50
            ? ('info' as const)
            : ('warning' as const);

        return (
          <div key={skill.name} className="flex items-center gap-4">
            <div className="w-36 flex-shrink-0">
              <span className="text-sm font-medium text-gray-700">{skill.name}</span>
            </div>
            <div className="flex-1">
              <ProgressBar value={percentage} variant={variant} />
            </div>
            <div className="w-12 text-right">
              <span className="text-sm text-gray-500">
                {skill.level}/{skill.maxLevel}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
