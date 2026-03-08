import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Sparkles, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { addEntry, type FoodEntry } from "@/lib/calorie-store";
import { supabase } from "@/integrations/supabase/client";

interface AddFoodDialogProps {
  onAdded: () => void;
}

interface AiResult {
  name: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
}

export function AddFoodDialog({ onAdded }: AddFoodDialogProps) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<AiResult[] | null>(null);
  const { toast } = useToast();

  const analyzeFood = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResults(null);

    try {
      const { data, error } = await supabase.functions.invoke('analyze-food', {
        body: { description: input.trim() },
      });

      if (error) throw error;

      if (data?.items && Array.isArray(data.items)) {
        setResults(data.items);
      } else {
        throw new Error("Ungültiges Antwortformat");
      }
    } catch (e: any) {
      console.error("AI error:", e);
      toast({
        title: "Fehler bei der Analyse",
        description: e.message || "Bitte versuche es erneut.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addItems = () => {
    if (!results) return;
    results.forEach(item => {
      const entry: FoodEntry = {
        id: crypto.randomUUID(),
        name: item.name,
        calories: item.calories,
        protein: item.protein,
        carbs: item.carbs,
        fat: item.fat,
        timestamp: Date.now(),
      };
      addEntry(entry);
    });
    toast({ title: `${results.length} Einträge hinzugefügt ✓` });
    setInput("");
    setResults(null);
    setOpen(false);
    onAdded();
  };

  const reset = () => {
    setInput("");
    setResults(null);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) reset(); }}>
      <DialogTrigger asChild>
        <Button className="gap-2 rounded-full shadow-lg" size="lg">
          <Plus className="w-5 h-5" />
          Essen eintragen
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-['Space_Grotesk']">Was hast du gegessen?</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            placeholder="z.B. 2 Scheiben Toast mit Butter und Marmelade, ein Glas Orangensaft..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={3}
            disabled={loading}
          />

          {!results && (
            <Button
              onClick={analyzeFood}
              disabled={!input.trim() || loading}
              className="w-full gap-2"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              {loading ? "Analysiere..." : "AI Kalorien berechnen"}
            </Button>
          )}

          {results && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground font-medium">Geschätzte Nährwerte:</p>
              {results.map((item, i) => (
                <div key={i} className="p-3 rounded-lg bg-secondary/50 border border-border">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-sm">{item.name}</span>
                    <span className="font-bold text-sm font-['Space_Grotesk'] text-primary">
                      {item.calories} kcal
                    </span>
                  </div>
                  {(item.protein || item.carbs || item.fat) && (
                    <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                      {item.protein != null && <span>Protein: {item.protein}g</span>}
                      {item.carbs != null && <span>Kohlenhydrate: {item.carbs}g</span>}
                      {item.fat != null && <span>Fett: {item.fat}g</span>}
                    </div>
                  )}
                </div>
              ))}
              <div className="flex justify-between p-2 rounded bg-primary/10">
                <span className="text-sm font-medium">Gesamt</span>
                <span className="font-bold font-['Space_Grotesk'] text-primary">
                  {results.reduce((s, i) => s + i.calories, 0)} kcal
                </span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={reset} className="flex-1">
                  Nochmal
                </Button>
                <Button onClick={addItems} className="flex-1">
                  Hinzufügen
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
