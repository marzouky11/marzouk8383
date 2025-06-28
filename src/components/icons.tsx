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
  Paintbrush,
  CookingPot,
  Shirt,
  BookOpen,
  Stethoscope,
  Calculator,
  Code,
  Camera,
  Shield,
  ConciergeBell,
  Sprout,
  Languages,
  Dumbbell,
  Music,
  Palette,
  CircuitBoard,
  Megaphone,
  Gavel,
  Pipette,
  Dog,
  Layers,
  ShowerHead,
  KanbanSquare
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
  Paintbrush,
  CookingPot,
  Shirt,
  BookOpen,
  Stethoscope,
  Calculator,
  Code,
  Camera,
  Shield,
  ConciergeBell,
  Sprout,
  Languages,
  Dumbbell,
  Music,
  Palette,
  CircuitBoard,
  Megaphone,
  Gavel,
  Pipette,
  Dog,
  Layers,
  ShowerHead,
  KanbanSquare,
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
