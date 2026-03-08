import { Trash2, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { FoodEntry } from "@/lib/calorie-store";

interface FoodEntryCardProps {
  entry: FoodEntry;
  onRemove: (id: string) => void;
}

export function FoodEntryCard({ entry, onRemove }: FoodEntryCardProps) {
  const time = new Date(entry.timestamp).toLocaleTimeString('de-DE', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-card border border-border hover:shadow-sm transition-shadow">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Flame className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="font-medium text-sm">{entry.name}</p>
          <p className="text-xs text-muted-foreground">{time}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="font-semibold text-sm font-['Space_Grotesk']">{entry.calories} kcal</p>
          {(entry.protein || entry.carbs || entry.fat) && (
            <p className="text-xs text-muted-foreground">
              {entry.protein ? `P: ${entry.protein}g` : ''}
              {entry.carbs ? ` K: ${entry.carbs}g` : ''}
              {entry.fat ? ` F: ${entry.fat}g` : ''}
            </p>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-destructive"
          onClick={() => onRemove(entry.id)}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
