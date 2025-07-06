interface StreakCounterProps {
  currentStreak: number | undefined;
} 

const StreakCounter = ({
  currentStreak,
}: StreakCounterProps) => {
  return (
    <div className="bg-gradient-to-br from-orange-50 to-red-50 border flex-1  border-orange-200 rounded-lg shadow-lg p-6 h-full shrink-0">
      <div className="text-center mb-4">
        <div className="flex items-center justify-center gap-2">
          <span className="text-2xl">🔥</span>
          <h2 className="text-xl font-semibold">Daily Streak</h2>
        </div>
      </div>

      <div className="text-center space-y-4">
        <div className="space-y-2">
          <div className="text-5xl font-bold text-orange-600 animate-pulse">
            {currentStreak}
          </div>
          <div className="text-sm text-gray-600">Days in a row</div>
        </div>
        <div className="text-xs text-orange-600 font-medium mt-4">
          Keep it up! Complete today's lesson to maintain your streak 💪
        </div>
      </div>
    </div>
  );
};

export default StreakCounter;
