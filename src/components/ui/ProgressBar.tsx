interface ProgressBarProps {
  value: number;
  label?: string;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
  className?: string;
}

export default function ProgressBar({
  value,
  label,
  variant = 'primary',
  className = '',
}: ProgressBarProps) {
  const clampedValue = Math.max(0, Math.min(100, value));

  const variantStyles = {
    primary: 'bg-primary-500',
    success: 'bg-green-500',
    warning: 'bg-amber-500',
    danger: 'bg-red-500',
    info: 'bg-blue-500',
  };

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          <span className="text-sm text-gray-500">{clampedValue}%</span>
        </div>
      )}
      <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${variantStyles[variant]}`}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    </div>
  );
}
