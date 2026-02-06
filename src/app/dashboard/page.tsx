"use client";

import { useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Plus, Sparkles, Clock3, Trash2 } from "lucide-react";

type MealEntry = {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  createdAt: Date;
};

function formatDate(d: Date) {
  return d.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  });
}

function formatTime(d: Date) {
  return d.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function toNumberOrZero(s: string) {
  const n = Number(s);
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, n);
}

export default function DashboardPage() {
  const targetKcal = 1700;

  const [meals, setMeals] = useState<MealEntry[]>([
    {
      id: crypto.randomUUID(),
      name: "Chicken & Rice Bowl",
      calories: 520,
      protein: 48,
      carbs: 55,
      fat: 12,
      createdAt: new Date(new Date().setHours(13, 5, 0, 0)),
    },
    {
      id: crypto.randomUUID(),
      name: "Greek Yogurt + Berries",
      calories: 240,
      protein: 22,
      carbs: 28,
      fat: 4,
      createdAt: new Date(new Date().setHours(10, 22, 0, 0)),
    },
    {
      id: crypto.randomUUID(),
      name: "Eggs on Toast",
      calories: 488,
      protein: 32,
      carbs: 34,
      fat: 22,
      createdAt: new Date(new Date().setHours(8, 11, 0, 0)),
    },
  ]);

  const [form, setForm] = useState({
    name: "",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
  });

  const totals = useMemo(() => {
    return meals.reduce(
      (acc, m) => {
        acc.calories += m.calories;
        acc.protein += m.protein;
        acc.carbs += m.carbs;
        acc.fat += m.fat;
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  }, [meals]);

  const remaining = Math.max(0, targetKcal - totals.calories);
  const kcalProgress = Math.min(
    100,
    Math.round((totals.calories / targetKcal) * 100)
  );

  const macros = [
    { label: "Protein", value: totals.protein, unit: "g", target: 170 },
    { label: "Carbs", value: totals.carbs, unit: "g", target: 130 },
    { label: "Fat", value: totals.fat, unit: "g", target: 55 },
    { label: "Fibre", value: 18, unit: "g", target: 30 },
  ];

  function onQuickAdd() {
    const name = form.name.trim();
    const hasAnyNumbers =
      form.calories || form.protein || form.carbs || form.fat;

    if (!name || !hasAnyNumbers) return;

    const entry: MealEntry = {
      id: crypto.randomUUID(),
      name,
      calories: toNumberOrZero(form.calories),
      protein: toNumberOrZero(form.protein),
      carbs: toNumberOrZero(form.carbs),
      fat: toNumberOrZero(form.fat),
      createdAt: new Date(),
    };

    setMeals((prev) => [entry, ...prev]);
    setForm({ name: "", calories: "", protein: "", carbs: "", fat: "" });
  }

  function onDeleteMeal(id: string) {
    setMeals((prev) => prev.filter((m) => m.id !== id));
  }

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-sm text-muted-foreground">
              {formatDate(new Date())}
            </div>
            <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
              Dashboard
            </h1>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" className="rounded-xl">
              <Sparkles className="mr-2 h-4 w-4" />
              Scan (later)
            </Button>
            <Button className="rounded-xl">
              <Plus className="mr-2 h-4 w-4" />
              Quick Add
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          {/* Hero */}
          <Card className="lg:col-span-7 rounded-2xl border-zinc-200/60 bg-white/70 p-6 shadow-sm backdrop-blur">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Today</div>
                <div className="mt-2 flex items-end gap-3">
                  <div className="text-5xl font-semibold">
                    {totals.calories}
                  </div>
                  <div className="pb-2 text-sm text-muted-foreground">kcal</div>
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  Target {targetKcal} • Remaining {remaining}
                </div>
              </div>
              <Badge variant="secondary" className="rounded-xl">
                {kcalProgress}% of target
              </Badge>
            </div>

            <div className="mt-5">
              <Progress value={kcalProgress} className="h-2" />
            </div>
          </Card>

          {/* Macros */}
          <div className="lg:col-span-5 grid gap-4">
            <Card className="rounded-2xl border-zinc-200/60 bg-white/70 p-5 shadow-sm backdrop-blur">
              <div className="text-sm font-semibold">Macros</div>
              <div className="mt-4 grid gap-3">
                {macros.map((m) => {
                  const pct = Math.min(
                    100,
                    Math.round((m.value / m.target) * 100)
                  );
                  return (
                    <div
                      key={m.label}
                      className="rounded-2xl border border-zinc-200/60 bg-white p-4"
                    >
                      <div className="flex justify-between text-sm">
                        <span>{m.label}</span>
                        <span className="text-muted-foreground">
                          {m.value}
                          {m.unit} / {m.target}
                          {m.unit}
                        </span>
                      </div>
                      <Progress value={pct} className="mt-2 h-2" />
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Quick Add */}
          <Card className="lg:col-span-5 rounded-2xl border-zinc-200/60 bg-white/70 p-6 shadow-sm backdrop-blur">
            <div className="text-sm font-semibold">Quick Add Meal</div>
            <div className="mt-4 grid gap-3">
              <Input
                placeholder="Meal name"
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
              />
              <div className="grid grid-cols-2 gap-3">
                <Input
                  placeholder="Calories"
                  value={form.calories}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, calories: e.target.value }))
                  }
                />
                <Input
                  placeholder="Protein"
                  value={form.protein}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, protein: e.target.value }))
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  placeholder="Carbs"
                  value={form.carbs}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, carbs: e.target.value }))
                  }
                />
                <Input
                  placeholder="Fat"
                  value={form.fat}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, fat: e.target.value }))
                  }
                />
              </div>
              <Button onClick={onQuickAdd}>
                <Plus className="mr-2 h-4 w-4" />
                Add to today
              </Button>
            </div>
          </Card>

          {/* Recent meals */}
          <Card className="lg:col-span-7 rounded-2xl border-zinc-200/60 bg-white/70 p-6 shadow-sm backdrop-blur">
            <div className="text-sm font-semibold mb-4">Recent meals</div>
            <div className="grid gap-3">
              {meals.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center justify-between rounded-2xl border bg-white p-4"
                >
                  <div>
                    <div className="text-sm font-medium">{m.name}</div>
                    <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock3 className="h-3 w-3" />
                      {formatTime(m.createdAt)} • {m.protein}P / {m.carbs}C /{" "}
                      {m.fat}F
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-sm font-semibold">
                      {m.calories} kcal
                    </div>
                    <button
                      onClick={() => onDeleteMeal(m.id)}
                      className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
                      aria-label="Delete meal"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
