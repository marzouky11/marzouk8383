import {
  Hammer,
  Zap,
  Utensils,
  BrickWall,
  PenTool,
  SprayCan,
  Bike,
  Wrench,
  Car,
  LucideIcon,
  Briefcase,
} from 'lucide-react';

const iconMap: { [key: string]: LucideIcon } = {
  Hammer,
  Zap,
  Utensils,
  BrickWall,
  PenTool,
  SprayCan,
  Bike,
  Wrench,
  Car,
  Default: Briefcase,
};

interface CategoryIconProps {
  name: string;
  className?: string;
}

export function CategoryIcon({ name, className }: CategoryIconProps) {
  const Icon = iconMap[name] || iconMap.Default;
  return <Icon className={className} />;
}
