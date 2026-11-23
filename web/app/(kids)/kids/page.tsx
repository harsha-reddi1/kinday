"use client";

import { useState } from "react";
import confetti from "canvas-confetti";
import { Star, Lock, CheckCircle2, Circle, Sun, Moon, Sparkles, BookOpen, Shirt, Backpack } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface RoutineItem {
  id: string;
  title: string;
  timeOfDay: "morning" | "afternoon" | "evening";
  stars: number;
  iconName: string;
  status: "to_do" | "done" | "waiting_approval";
}

const INITIAL_ROUTINES: RoutineItem[] = [
  { id: "1", title: "Brush Teeth", timeOfDay: "morning", stars: 1, iconName: "sparkles", status: "to_do" },
  { id: "2", title: "Put on Clothes", timeOfDay: "morning", stars: 1, iconName: "shirt", status: "to_do" },
  { id: "3", title: "Pack Backpack", timeOfDay: "morning", stars: 2, iconName: "backpack", status: "to_do" },
  { id: "4", title: "20 Mins Reading", timeOfDay: "afternoon", stars: 2, iconName: "book", status: "to_do" },
  { id: "5", title: "Tidy Up Toys", timeOfDay: "evening", stars: 1, iconName: "sparkles", status: "to_do" },
  { id: "6", title: "Bedtime on Time", timeOfDay: "evening", stars: 2, iconName: "moon", status: "to_do" },
];

export default function KidsZonePage() {
  const router = useRouter();
  const [routines, setRoutines] = useState<RoutineItem[]>(INITIAL_ROUTINES);
  const [totalStars, setTotalStars] = useState(14);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);

  const triggerCelebration = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#FBBF24", "#F59E0B", "#10B981", "#38BDF8", "#EC4899"],
    });
  };

  const handleToggleRoutine = (id: string) => {
    setRoutines((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          if (r.status === "to_do") {
            triggerCelebration();
            setTotalStars((s) => s + r.stars);
            return { ...r, status: "done" };
          } else {
            setTotalStars((s) => Math.max(0, s - r.stars));
            return { ...r, status: "to_do" };
          }
        }
        return r;
      })
    );
  };

  const handleVerifyPin = () => {
    // Default demo pin is 1234
    if (pinInput === "1234") {
      router.push("/dashboard");
    } else {
      setPinError(true);
      setPinInput("");
    }
  };

  const renderIcon = (name: string) => {
    switch (name) {
      case "shirt":
        return <Shirt className="w-8 h-8 text-indigo-500" />;
      case "backpack":
        return <Backpack className="w-8 h-8 text-amber-600" />;
      case "book":
        return <BookOpen className="w-8 h-8 text-emerald-600" />;
      case "moon":
        return <Moon className="w-8 h-8 text-purple-600" />;
      default:
        return <Sparkles className="w-8 h-8 text-amber-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-amber-50/50 p-4 sm:p-8 flex flex-col justify-between">
      {/* Top Header: Child profile, stars, and parent exit lock */}
      <header className="flex items-center justify-between pb-6 border-b border-amber-200/60">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-amber-200 flex items-center justify-center text-3xl shadow-sm">
            🦁
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">Leo's Day</h1>
            <p className="text-xs sm:text-sm font-medium text-stone-500">Today's checklist</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Star Counter */}
          <div className="flex items-center gap-2 bg-amber-100/90 border border-amber-300/80 px-4 py-2 rounded-2xl shadow-sm">
            <Star className="w-6 h-6 fill-amber-500 text-amber-500 animate-pulse" />
            <span className="text-xl sm:text-2xl font-black text-amber-900">{totalStars}</span>
          </div>

          {/* Parent Lock Gate Button */}
          <button
            onClick={() => setShowPinModal(true)}
            className="p-3 bg-white hover:bg-stone-100 rounded-2xl border border-stone-200 text-stone-600 shadow-sm transition-all"
            title="Exit to Parent Hub"
          >
            <Lock className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Routine Responsive Vertical Fluid Grid */}
      <main className="my-8 flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {routines.map((routine) => {
            const isDone = routine.status === "done";
            return (
              <div
                key={routine.id}
                onClick={() => handleToggleRoutine(routine.id)}
                className={`cursor-pointer select-none rounded-3xl p-6 transition-all duration-200 flex flex-col justify-between border-2 shadow-sm ${
                  isDone
                    ? "bg-emerald-50/90 border-emerald-400 opacity-90 scale-[0.98]"
                    : "bg-white border-amber-200 hover:border-amber-400 hover:shadow-md"
                }`}
                style={{ minHeight: "150px" }}
              >
                <div className="flex items-start justify-between">
                  <div className="p-3 rounded-2xl bg-stone-50 border border-stone-100">
                    {renderIcon(routine.iconName)}
                  </div>
                  <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 text-xs font-bold text-amber-800">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    +{routine.stars}
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <h3 className={`text-xl font-bold tracking-tight ${isDone ? "line-through text-stone-400" : "text-stone-900"}`}>
                      {routine.title}
                    </h3>
                    <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                      {routine.timeOfDay}
                    </span>
                  </div>

                  <div className="transition-transform duration-200">
                    {isDone ? (
                      <CheckCircle2 className="w-10 h-10 text-emerald-500 fill-emerald-100" />
                    ) : (
                      <Circle className="w-10 h-10 text-stone-300 hover:text-amber-500" />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Rewards Footer (Read-only for children) */}
      <footer className="bg-white/80 border border-amber-200/60 rounded-3xl p-4 sm:p-5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-amber-500" />
          <span className="text-sm sm:text-base font-bold text-stone-800">Goal: Weekend Zoo Trip</span>
        </div>
        <div className="text-xs sm:text-sm font-semibold text-stone-500">
          {totalStars} / 25 Stars Earned
        </div>
      </footer>

      {/* Parent PIN Lock Modal */}
      {showPinModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center mx-auto text-stone-600">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-stone-900">Parent Access</h3>
            <p className="text-xs text-stone-500">Enter your 4-digit Parent PIN to exit the Kids Zone.</p>

            <input
              type="password"
              maxLength={4}
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              placeholder="••••"
              className="w-36 text-center text-3xl font-mono tracking-widest py-3 border-2 border-stone-200 rounded-2xl mx-auto focus:border-orange-500 focus:outline-none"
              autoFocus
            />

            {pinError && <p className="text-xs text-rose-500 font-semibold">Incorrect PIN (Hint: 1234 for demo)</p>}

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  setShowPinModal(false);
                  setPinError(false);
                  setPinInput("");
                }}
                className="flex-1 py-3 bg-stone-100 rounded-2xl text-stone-600 font-semibold text-sm hover:bg-stone-200"
              >
                Cancel
              </button>
              <button
                onClick={handleVerifyPin}
                className="flex-1 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl font-semibold text-sm shadow-sm"
              >
                Unlock
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
