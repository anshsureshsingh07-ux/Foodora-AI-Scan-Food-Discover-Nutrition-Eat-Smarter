import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Bell, CheckCircle2 } from "lucide-react";

interface CookingTimerProps {
  initialMinutes: number;
  stepTitle?: string;
  onComplete?: () => void;
}

export const CookingTimer: React.FC<CookingTimerProps> = ({
  initialMinutes,
  stepTitle,
  onComplete,
}) => {
  const [totalSeconds, setTotalSeconds] = useState(initialMinutes * 60);
  const [secondsRemaining, setSecondsRemaining] = useState(initialMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const intervalRef = useRef<any>(null);

  useEffect(() => {
    setTotalSeconds(initialMinutes * 60);
    setSecondsRemaining(initialMinutes * 60);
    setIsRunning(false);
    setIsCompleted(false);
  }, [initialMinutes]);

  useEffect(() => {
    if (isRunning && secondsRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            setIsCompleted(true);
            if (onComplete) onComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, secondsRemaining, onComplete]);

  const toggleRunning = () => {
    if (secondsRemaining === 0) {
      setSecondsRemaining(totalSeconds);
      setIsCompleted(false);
      setIsRunning(true);
    } else {
      setIsRunning((prev) => !prev);
    }
  };

  const resetTimer = () => {
    setIsRunning(false);
    setSecondsRemaining(totalSeconds);
    setIsCompleted(false);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const progressPercent = totalSeconds > 0
    ? ((totalSeconds - secondsRemaining) / totalSeconds) * 100
    : 100;

  return (
    <div className="inline-flex items-center gap-3 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs shadow-xs">
      <div className="flex items-center gap-1.5 font-mono font-bold text-slate-800 dark:text-slate-200">
        <Bell className={`w-3.5 h-3.5 ${isRunning ? "text-emerald-500 animate-pulse" : "text-slate-400"}`} />
        <span>{formatTime(secondsRemaining)}</span>
      </div>

      {/* Mini Progress bar */}
      <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${
            isCompleted ? "bg-emerald-500" : "bg-emerald-600"
          }`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={toggleRunning}
          className={`p-1 rounded-lg transition-colors cursor-pointer ${
            isRunning
              ? "bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 hover:bg-amber-200"
              : "bg-emerald-600 text-white hover:bg-emerald-700"
          }`}
          title={isRunning ? "Pause timer" : "Start timer"}
        >
          {isRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
        </button>
        <button
          type="button"
          onClick={resetTimer}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          title="Reset timer"
        >
          <RotateCcw className="w-3 h-3" />
        </button>
      </div>

      {isCompleted && (
        <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 animate-bounce">
          <CheckCircle2 className="w-3 h-3" /> Done!
        </span>
      )}
    </div>
  );
};
