import {
  Hammer,
  Zap,
  Utensils,
  HardHat,
  PenTool,
  SprayCan,
  Bike,
  Wrench,
  Car,
  LucideIcon,
  Briefcase,
  Scissors,
} from 'lucide-react';

const iconMap: { [key: string]: LucideIcon } = {
  Hammer,
  Zap,
  Utensils,
  HardHat,
  PenTool,
  SprayCan,
  Bike,
  Wrench,
  Car,
  Scissors,
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
