import { getWeekData, getTotalCalories } from "@/lib/calorie-store";

export function WeekChart() {
  const week = getWeekData();
  const maxCal = Math.max(...week.map(d => getTotalCalories(d.entries)), 1);
  const dayNames = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];

  return (
    <div className="p-4 rounded-xl bg-card border border-border">
      <h3 className="text-sm font-semibold mb-4 font-['Space_Grotesk']">Letzte 7 Tage</h3>
      <div className="flex items-end justify-between gap-1 h-28">
        {week.map((day) => {
          const total = getTotalCalories(day.entries);
          const height = Math.max((total / maxCal) * 100, 4);
          const date = new Date(day.date + 'T12:00:00');
          const isToday = day.date === new Date().toISOString().split('T')[0];
          const overGoal = total > day.goal;

          return (
            <div key={day.date} className="flex flex-col items-center flex-1 gap-1">
              <span className="text-[10px] text-muted-foreground font-medium">
                {total > 0 ? total : ''}
              </span>
              <div
                className={`w-full max-w-8 rounded-t-md transition-all duration-500 ${
                  overGoal
                    ? 'bg-destructive/70'
                    : isToday
                    ? 'bg-primary'
                    : 'bg-primary/40'
                }`}
                style={{ height: `${height}%` }}
              />
              <span className={`text-xs font-medium ${isToday ? 'text-primary' : 'text-muted-foreground'}`}>
                {dayNames[date.getDay()]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
