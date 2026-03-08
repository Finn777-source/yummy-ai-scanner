import { cn } from "@/lib/utils";

interface CalorieRingProps {
  consumed: number;
  goal: number;
  className?: string;
}

export function CalorieRing({ consumed, goal, className }: CalorieRingProps) {
  const percentage = Math.min((consumed / goal) * 100, 100);
  const remaining = Math.max(goal - consumed, 0);
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  const isOver = consumed > goal;

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className="relative w-48 h-48">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
          <circle
            cx="100" cy="100" r={radius}
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="12"
          />
          <circle
            cx="100" cy="100" r={radius}
            fill="none"
            stroke={isOver ? "hsl(var(--destructive))" : "hsl(var(--primary))"}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold font-['Space_Grotesk']">{consumed}</span>
          <span className="text-xs text-muted-foreground">von {goal} kcal</span>
        </div>
      </div>
      <div className="mt-3 text-center">
        {isOver ? (
          <span className="text-sm font-medium text-destructive">
            {consumed - goal} kcal über dem Ziel
          </span>
        ) : (
          <span className="text-sm font-medium text-muted-foreground">
            Noch {remaining} kcal übrig
          </span>
        )}
      </div>
    </div>
  );
}
