import { useState, useCallback } from "react";
import { CalorieRing } from "@/components/CalorieRing";
import { FoodEntryCard } from "@/components/FoodEntryCard";
import { AddFoodDialog } from "@/components/AddFoodDialog";
import { WeekChart } from "@/components/WeekChart";
import { getDailyData, removeEntry, getTotalCalories, getGoal, setGoal as saveGoal } from "@/lib/calorie-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Settings, Apple, UtensilsCrossed } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const Index = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [goalInput, setGoalInput] = useState(getGoal().toString());
  const [goalOpen, setGoalOpen] = useState(false);

  const refresh = useCallback(() => setRefreshKey((k) => k + 1), []);

  const data = getDailyData();
  const total = getTotalCalories(data.entries);
  const goal = data.goal;

  const handleRemove = (id: string) => {
    removeEntry(id);
    refresh();
  };

  const handleSaveGoal = () => {
    const num = parseInt(goalInput, 10);
    if (num > 0) {
      saveGoal(num);
      setGoalOpen(false);
      refresh();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-lg mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Apple className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-lg font-bold font-['Space_Grotesk']">NutriTrack</h1>
          </div>
          <Dialog open={goalOpen} onOpenChange={setGoalOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Settings className="w-5 h-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xs">
              <DialogHeader>
                <DialogTitle className="font-['Space_Grotesk']">Kalorienziel</DialogTitle>
              </DialogHeader>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={goalInput}
                  onChange={(e) => setGoalInput(e.target.value)}
                  placeholder="2000"
                  min={500}
                  max={10000}
                />
                <Button onClick={handleSaveGoal}>Speichern</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 pb-28">
        {/* Calorie Ring */}
        <section className="py-6">
          <CalorieRing consumed={total} goal={goal} />
        </section>

        {/* Macros summary */}
        {data.entries.length > 0 && (
          <section className="grid grid-cols-3 gap-3 mb-6">
            {[
              {
                label: "Protein",
                value: data.entries.reduce((s, e) => s + (e.protein || 0), 0),
                unit: "g",
                color: "text-primary",
              },
              {
                label: "Kohlenhydrate",
                value: data.entries.reduce((s, e) => s + (e.carbs || 0), 0),
                unit: "g",
                color: "text-accent-foreground",
              },
              {
                label: "Fett",
                value: data.entries.reduce((s, e) => s + (e.fat || 0), 0),
                unit: "g",
                color: "text-destructive",
              },
            ].map((macro) => (
              <div
                key={macro.label}
                className="p-3 rounded-xl bg-card border border-border text-center"
              >
                <p className="text-xs text-muted-foreground mb-1">{macro.label}</p>
                <p className={`text-lg font-bold font-['Space_Grotesk'] ${macro.color}`}>
                  {macro.value}
                  <span className="text-xs font-normal text-muted-foreground ml-0.5">
                    {macro.unit}
                  </span>
                </p>
              </div>
            ))}
          </section>
        )}

        {/* Week Chart */}
        <section className="mb-6">
          <WeekChart key={refreshKey} />
        </section>

        {/* Today's entries */}
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground mb-3 font-['Space_Grotesk'] uppercase tracking-wider">
            Heute
          </h2>
          {data.entries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <UtensilsCrossed className="w-12 h-12 text-muted-foreground/30 mb-3" />
              <p className="text-muted-foreground text-sm">Noch nichts gegessen heute?</p>
              <p className="text-muted-foreground/60 text-xs mt-1">
                Tippe auf den Button unten um loszulegen
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {data.entries.map((entry) => (
                <FoodEntryCard key={entry.id} entry={entry} onRemove={handleRemove} />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Floating Add Button */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-20">
        <AddFoodDialog onAdded={refresh} />
      </div>
    </div>
  );
};

export default Index;
