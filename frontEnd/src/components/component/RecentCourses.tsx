import { ArrowRight } from "lucide-react";

const mockCourses = [
  {
    id: 1,
    title: "JavaScript Essentials",
    description: "Master the building blocks of JS programming.",
    enrolledDate: "2025-06-01",
  },
  {
    id: 2,
    title: "React Fundamentals",
    description: "Dive into components, hooks, and state management.",
    enrolledDate: "2025-05-28",
  },
  {
    id: 3,
    title: "Git & GitHub Mastery",
    description: "Learn version control workflows and collaboration.",
    enrolledDate: "2025-05-20",
  },
];

const RecentCourses = () => {
  return (
    <div className="neumorphic p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        📚 Recent Enrolled Courses
      </h2>
      <ul className="flex gap-5 flex-wrap">
        {mockCourses.map((course) => (
          <li
            key={course.id}
            className="neumorphic-inset p-4 w-80 transition-transform hover:scale-[1.01]"
          >
            <h3 className="text-lg font-medium text-gray-900">
              {course.title}
            </h3>
            <p className="text-gray-600 text-sm">{course.description}</p>
            <p className="text-xs text-gray-400 mt-1">
              Enrolled on {course.enrolledDate}
            </p>
            <button className="mt-3 inline-flex items-center gap-1 text-orange-500 hover:underline">
              Continue <ArrowRight size={16} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentCourses;
