import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, X, Play, Pause, RotateCcw, Award, Music } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { DinerRecipe } from '../data/recipes';
import { sounds } from '../utils/soundEffects';

interface CookModeProps {
  recipe: DinerRecipe;
  onClose: () => void;
  onFinishCooking: (recipe: DinerRecipe) => void;
}

export const CookMode: React.FC<CookModeProps> = ({
  recipe,
  onClose,
  onFinishCooking,
}) => {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(true);

  // Timer calculation
  const defaultTimerSec = (recipe.steps[currentStepIdx]?.durationMin || 3) * 60;
  const [timerSeconds, setTimerSeconds] = useState(defaultTimerSec);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerIntervalRef = useRef<number | null>(null);

  // 1. MUSIC ONLY WHEN WE START COOKING:
  // Automatically start retro diner jukebox music as cooking starts
  useEffect(() => {
    sounds.startJukebox();
    setIsMusicPlaying(true);

    return () => {
      // Clean up music & sizzle when leaving Cook Mode
      sounds.stopJukebox();
      sounds.stopSizzle();
    };
  }, []);

  // 2. Keep Screen Awake via Wake Lock API on mobile phones
  useEffect(() => {
    let wakeLockSentinel: any = null;

    async function requestWakeLock() {
      try {
        if ('wakeLock' in navigator) {
          wakeLockSentinel = await (navigator as any).wakeLock.request('screen');
        }
      } catch {
        // WakeLock not supported or denied
      }
    }

    requestWakeLock();

    return () => {
      if (wakeLockSentinel) {
        wakeLockSentinel.release().catch(() => {});
      }
    };
  }, []);

  // Update timer whenever step changes if that step has a specific duration
  useEffect(() => {
    const stepDuration = recipe.steps[currentStepIdx]?.durationMin;
    if (stepDuration) {
      setTimerSeconds(stepDuration * 60);
      setIsTimerRunning(false);
    }
  }, [currentStepIdx, recipe]);

  // Timer Tick & Sizzle Interval
  useEffect(() => {
    if (isTimerRunning) {
      sounds.startSizzle();
      timerIntervalRef.current = window.setInterval(() => {
        setTimerSeconds(prev => {
          if (prev <= 1) {
            clearInterval(timerIntervalRef.current!);
            setIsTimerRunning(false);
            sounds.stopSizzle();
            sounds.playDinerBell();
            sounds.playWinJingle();
            return 0;
          }
          if (prev % 5 === 0) {
            sounds.playTimerTick();
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      sounds.stopSizzle();
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }

    return () => {
      sounds.stopSizzle();
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isTimerRunning]);

  const toggleMusic = () => {
    sounds.playBoop(550);
    if (isMusicPlaying) {
      sounds.stopJukebox();
      setIsMusicPlaying(false);
    } else {
      sounds.startJukebox();
      setIsMusicPlaying(true);
    }
  };

  const toggleTimer = () => {
    sounds.playBoop(isTimerRunning ? 400 : 700);
    setIsTimerRunning(!isTimerRunning);
  };

  const resetTimer = (seconds: number) => {
    sounds.playBoop(500);
    setIsTimerRunning(false);
    setTimerSeconds(seconds);
  };

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainingSec = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSec.toString().padStart(2, '0')}`;
  };

  const goToNextStep = () => {
    sounds.playBoop(620);
    if (currentStepIdx < recipe.steps.length - 1) {
      setCurrentStepIdx(currentStepIdx + 1);
    } else {
      // Completed all steps!
      setIsCompleted(true);
      sounds.stopJukebox();
      sounds.stopSizzle();
      sounds.playDinerBell();
      sounds.playWinJingle();
      confetti({
        particleCount: 120,
        spread: 85,
        origin: { y: 0.5 },
        colors: ['#E53935', '#FBC02D', '#FFFDF8', '#2B170C', '#2E7D32'],
      });
      onFinishCooking(recipe);
    }
  };

  const goToPrevStep = () => {
    sounds.playBoop(450);
    if (currentStepIdx > 0) {
      setCurrentStepIdx(currentStepIdx - 1);
    }
  };

  const handleExit = () => {
    sounds.stopJukebox();
    sounds.stopSizzle();
    sounds.playBoop(400);
    onClose();
  };

  const currentStep = recipe.steps[currentStepIdx];
  const progressPercent = Math.round(((currentStepIdx + 1) / recipe.steps.length) * 100);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Hands-Free Cooking Mode"
      className="fixed inset-0 z-50 bg-[#FBF5E6] flex flex-col justify-between max-w-md mx-auto border-x-4 border-[#2B170C] select-none"
    >
      {/* Top Header Bar */}
      <div className="bg-[#E53935] border-b-4 border-[#2B170C] p-3 text-[#FFFDF8] shrink-0">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <span className="text-2xl shrink-0" aria-hidden="true">👨‍🍳</span>
            <div className="overflow-hidden">
              <span className="text-xs font-black uppercase tracking-wider text-[#FBC02D] bg-[#2B170C] px-2 py-0.5 rounded">
                COOK MODE ACTIVE
              </span>
              <h2 className="text-base sm:text-lg font-retro truncate text-white mt-0.5">
                {recipe.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Cooking Music Toggle */}
            <button
              onClick={toggleMusic}
              title={isMusicPlaying ? 'Turn off cooking tunes' : 'Turn on cooking tunes'}
              aria-label={isMusicPlaying ? 'Cooking music is playing. Tap to turn off.' : 'Cooking music is off. Tap to play.'}
              aria-pressed={isMusicPlaying}
              className={`min-w-[44px] min-h-[44px] px-2.5 rounded-xl border-2 border-[#2B170C] text-xs font-bold flex items-center gap-1 cursor-pointer transition-all shadow-[2px_2px_0px_#2B170C] active:translate-y-0.5 ${
                isMusicPlaying
                  ? 'bg-[#FBC02D] text-[#2B170C]'
                  : 'bg-[#FFFDF8] text-[#2B170C]'
              }`}
            >
              <Music className={`w-4 h-4 ${isMusicPlaying ? 'animate-bounce text-[#C62828]' : 'text-gray-500'}`} />
              <span className="hidden sm:inline text-xs font-black">{isMusicPlaying ? 'MUSIC ON' : 'MUSIC OFF'}</span>
            </button>

            {/* Exit Cook Mode */}
            <button
              onClick={handleExit}
              aria-label="Close Cook Mode and return to Diner"
              className="min-w-[44px] min-h-[44px] rounded-xl bg-[#FFFDF8] text-[#2B170C] border-2 border-[#2B170C] shadow-[2px_2px_0px_#2B170C] active:translate-y-0.5 flex items-center justify-center cursor-pointer hover:bg-[#FFE3E3]"
            >
              <X className="w-5 h-5 text-[#2B170C]" />
            </button>
          </div>
        </div>

        {/* Progress Tracker */}
        <div className="mt-2.5 flex items-center gap-2.5 text-xs font-bold">
          <div
            role="progressbar"
            aria-valuenow={currentStepIdx + 1}
            aria-valuemin={1}
            aria-valuemax={recipe.steps.length}
            aria-label={`Step ${currentStepIdx + 1} of ${recipe.steps.length}`}
            className="flex-1 bg-[#2B170C]/40 h-3.5 rounded-full overflow-hidden border border-[#2B170C] p-0.5"
          >
            <div
              className="bg-[#FBC02D] h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-sm font-mono font-black text-[#FBC02D] shrink-0">
            {currentStepIdx + 1} / {recipe.steps.length}
          </span>
        </div>
      </div>

      {/* Main Body */}
      <div className="flex-1 p-4 flex flex-col justify-between overflow-y-auto">
        {!isCompleted ? (
          <>
            {/* Step Card with enlarged high-contrast typography */}
            <div className="flex flex-col gap-3.5 my-auto" role="region" aria-live="polite">
              <div className="inline-flex items-center gap-2 self-start bg-[#2B170C] text-[#FBC02D] px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-retro tracking-wider">
                <span>STEP #{currentStep?.step}</span>
                <span className="w-2 h-2 rounded-full bg-[#E53935]" />
                <span>SHORT-ORDER METHOD</span>
              </div>

              {/* Big, Clear Instruction Text */}
              <div className="p-4 sm:p-5 bg-[#FFFDF8] border-3 border-[#2B170C] rounded-2xl shadow-[4px_5px_0px_#2B170C]">
                <p className="text-xl sm:text-2xl font-heading font-extrabold text-[#2B170C] leading-snug sm:leading-relaxed">
                  {currentStep?.instruction}
                </p>

                {currentStep?.tip && (
                  <div className="mt-3.5 p-3 bg-[#FFF9C4] border-2 border-[#2B170C] rounded-xl text-xs sm:text-sm font-bold text-[#801B1B] flex items-start gap-2 shadow-[1px_2px_0px_#2B170C]">
                    <span className="text-lg shrink-0" aria-hidden="true">💡</span>
                    <span><b>Chef Note:</b> {currentStep.tip}</span>
                  </div>
                )}
              </div>

              {/* Integrated Retro Diner Kitchen Timer with large readable digits */}
              <div className="p-3.5 bg-[#EBF5EE] border-3 border-[#2B170C] rounded-2xl shadow-[3px_4px_0px_#2B170C] flex flex-col gap-2.5">
                <div className="flex items-center justify-between text-xs sm:text-sm font-black uppercase text-[#2B170C]">
                  <span className="flex items-center gap-1.5">
                    ⏱️ Vintage Griddle Timer
                  </span>
                  <div className="flex items-center gap-1.5" role="group" aria-label="Quick timer presets">
                    {[60, 180, 300].map(s => (
                      <button
                        key={s}
                        onClick={() => resetTimer(s)}
                        className="min-h-[36px] px-2.5 py-1 rounded-lg bg-[#FFFDF8] border-2 border-[#2B170C] text-xs font-black hover:bg-[#FBC02D] transition-colors cursor-pointer"
                        aria-label={`Set timer to ${s / 60} minutes`}
                      >
                        {s / 60}m
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span
                    aria-live="off"
                    className={`text-5xl sm:text-6xl font-mono font-black tracking-widest ${
                      timerSeconds === 0 ? 'text-[#C62828] animate-bounce' : 'text-[#2B170C]'
                    }`}
                  >
                    {formatTimer(timerSeconds)}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={toggleTimer}
                      aria-label={isTimerRunning ? 'Pause timer' : 'Start timer'}
                      className={`min-h-[48px] px-5 py-2.5 rounded-xl font-retro text-sm border-3 border-[#2B170C] shadow-[2px_2px_0px_#2B170C] active:translate-y-0.5 active:shadow-none flex items-center gap-2 cursor-pointer ${
                        isTimerRunning
                          ? 'bg-[#E53935] text-white hover:bg-[#FF5252]'
                          : 'bg-[#FBC02D] text-[#2B170C] hover:bg-[#FDD835]'
                      }`}
                    >
                      {isTimerRunning ? (
                        <>
                          <Pause className="w-4 h-4 fill-current" /> PAUSE
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 fill-current" /> START
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => resetTimer(180)}
                      title="Reset timer to 3 minutes"
                      aria-label="Reset timer"
                      className="min-w-[48px] min-h-[48px] rounded-xl bg-[#FFFDF8] border-3 border-[#2B170C] shadow-[2px_2px_0px_#2B170C] active:translate-y-0.5 active:shadow-none flex items-center justify-center cursor-pointer hover:bg-gray-100"
                    >
                      <RotateCcw className="w-5 h-5 text-[#2B170C]" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Step Navigation Controls (High Touch Target >= 48px) */}
            <div className="flex items-center gap-2.5 pt-3">
              <button
                onClick={goToPrevStep}
                disabled={currentStepIdx === 0}
                aria-label="Previous step"
                className={`min-h-[52px] py-3.5 px-5 rounded-2xl border-3 border-[#2B170C] font-retro text-sm uppercase flex items-center gap-1.5 cursor-pointer ${
                  currentStepIdx === 0
                    ? 'opacity-30 cursor-not-allowed bg-gray-200 text-gray-500'
                    : 'bg-[#FFFDF8] text-[#2B170C] shadow-[3px_3px_0px_#2B170C] hover:bg-[#FFF9C4]'
                }`}
              >
                <ChevronLeft className="w-5 h-5" /> PREV
              </button>

              <button
                onClick={goToNextStep}
                aria-label={currentStepIdx === recipe.steps.length - 1 ? 'Finish and plate order' : 'Next cooking step'}
                className="flex-1 min-h-[52px] py-3.5 px-5 rounded-2xl font-retro text-base uppercase flex items-center justify-center gap-2 cursor-pointer btn-tactile-red"
              >
                <span>{currentStepIdx === recipe.steps.length - 1 ? 'ORDER FINISHED! 🎉' : 'NEXT STEP'}</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </>
        ) : (
          /* Order Complete Celebration Screen */
          <div className="flex flex-col items-center justify-center text-center p-4 my-auto gap-4">
            <div className="w-24 h-24 rounded-full bg-[#FBC02D] border-4 border-[#2B170C] shadow-[4px_5px_0px_#2B170C] flex items-center justify-center text-5xl animate-bounce">
              🏆
            </div>

            <div className="border-2 border-dashed border-[#E53935] px-4 py-1.5 rounded-lg text-sm font-black uppercase text-[#C62828] font-ticket tracking-widest bg-[#FFE3E3]">
              ★ ORDER COMPLETE & PLATED ★
            </div>

            <h2 className="text-3xl sm:text-4xl font-retro text-[#E53935] retro-title-shadow leading-tight">
              DINER PERFECTION!
            </h2>

            <p className="text-sm font-bold text-[#2B170C] max-w-xs">
              You just spun fridge leftovers into an all-star diner classic.
            </p>

            <div className="p-4 bg-[#FFFDF8] border-3 border-[#2B170C] rounded-2xl shadow-[3px_3px_0px_#2B170C] w-full max-w-xs flex items-center justify-around">
              <div>
                <p className="text-xs font-black text-gray-700 uppercase">Saved Waste</p>
                <p className="text-lg font-retro text-emerald-800">+{recipe.wasteSavedLbs} lbs</p>
              </div>
              <div className="w-px h-10 bg-gray-400" />
              <div>
                <p className="text-xs font-black text-gray-700 uppercase">Chef Rating</p>
                <p className="text-lg font-retro text-[#B26A00]">5.0 ★</p>
              </div>
            </div>

            <button
              onClick={handleExit}
              className="w-full max-w-xs min-h-[50px] py-3.5 rounded-2xl font-retro text-base uppercase cursor-pointer btn-tactile-yellow flex items-center justify-center gap-2"
            >
              <Award className="w-5 h-5" />
              <span>RETURN TO COUNTER</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
