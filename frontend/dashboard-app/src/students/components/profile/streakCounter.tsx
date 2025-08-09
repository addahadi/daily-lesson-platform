interface StreakCounterProps {
  currentStreak: number | undefined;
}

const StreakCounter = ({ currentStreak }: StreakCounterProps) => {
  return (
    <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border border-orange-200 dark:border-orange-700 flex-1 rounded-lg shadow-lg p-4 sm:p-6 h-full shrink-0 transition-colors">
      <div className="text-center mb-4">
        <div className="flex items-center justify-center gap-2">
          <span className="text-xl sm:text-2xl">🔥</span>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
            Daily Streak
          </h2>
        </div>
      </div>

      <div className="text-center space-y-4">
        <div className="space-y-2">
          <div className="text-4xl sm:text-5xl font-bold text-orange-600 dark:text-orange-400 animate-pulse">
            {currentStreak || 0}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            Days in a row
          </div>
        </div>
        <div className="text-xs sm:text-sm text-orange-600 dark:text-orange-400 font-medium mt-4 px-2">
          Keep it up! Complete today's lesson to maintain your streak 💪
        </div>
      </div>
    </div>
  );
};

export default StreakCounter;
