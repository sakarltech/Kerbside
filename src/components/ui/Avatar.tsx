import Image from 'next/image';

interface AvatarProps {
  src?: string | null;
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeDimensions = {
  sm: 32,
  md: 40,
  lg: 56,
};

export default function Avatar({
  src,
  name,
  size = 'md',
  className = '',
}: AvatarProps) {
  const sizeStyles = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-lg',
  };

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  if (src) {
    return (
      <Image
        src={src}
        alt={name}
        width={sizeDimensions[size]}
        height={sizeDimensions[size]}
        className={`${sizeStyles[size]} rounded-full object-cover ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizeStyles[size]} rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-semibold ${className}`}
    >
      {initials}
    </div>
  );
}
