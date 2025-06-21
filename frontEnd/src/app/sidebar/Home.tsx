import DashboardWelcome from "@/components/component/DashboardWelcom";
import RecentCourses from "@/components/component/RecentCourses";
import TodaysLesson from "@/components/component/TodayLesson";


const Home = () => {
  return (
    <div>
      <DashboardWelcome />
      <RecentCourses />
      <TodaysLesson />
    </div>
  );
};

export default Home;
