import LoadingSpinner from "@/components/ui/loading"
import useAnalytic from "@/hook/useAnalytic"
import AdminActivity from "../components/analytics/AdminActivity"
import { Book, Users } from "lucide-react"
import CompletedLessonsChart from "../components/analytics/CompletedLessonsChart"

const AdminAnalytics = () => {1
  const { loading , lessonAnalyticData , userAnalyticData , streakAnalyticData , chartData} = useAnalytic()
  return (
    <div className=" min-h-screen ">
      <div className=" p-6 bg-white">
        <section className=" flex flex-col gap-2 w-full">
          <h1 className=" text-3xl font-semibold text-gray-800">Analytics</h1>
          <div className=" text-gray-400 font-semibold text-lg">
            Daily Lesson Platform Admin Overview
          </div>
        </section>
        <section className=" mt-3">
          {loading ? (
            <div className=" flex justify-center items-center h-36 w-full">
              <LoadingSpinner size={30} />
            </div>
          ) : (
            <div className=" grid grid-cols-3 gap-4">
              {lessonAnalyticData && (
                <AdminActivity
                  header="Total Completed Lessons"
                  value={lessonAnalyticData?.completed_lessons as number}
                  secondaryValue={`out of ${lessonAnalyticData.total_lessons} total lessons`}
                  percentage={lessonAnalyticData.percent_change as number}
                  Icon={Book}
                />
              )}
              {userAnalyticData && (
                <AdminActivity
                  header="Active Users"
                  value={userAnalyticData?.active_users as number}
                  secondaryValue={`out of ${userAnalyticData.total_users} total users`}
                  Icon={Users}
                />
              )}
              {streakAnalyticData && (
                <AdminActivity
                  header="Average Users Streak"
                  value={streakAnalyticData?.average_streaks as number}
                  secondaryValue="days consecutive learning"
                  percentage={streakAnalyticData?.percent_change as number}
                  Icon={Users}
                />
              )}
            </div>
          )}
        </section>
      </div>
      <div>
        <CompletedLessonsChart  chartData = {chartData as Record<string , number>[]} />
      </div>
    </div>
  );
}

export default AdminAnalytics