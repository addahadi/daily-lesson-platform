
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white-1">
      <header className="p-6 flex justify-between items-center">
        <div className=" flex justify-center gap-4 items-center ">
          <img src="../public/icon/logo.svg" alt="logo" width={40} />
          <h2 className="text-xl font-semibold">Learn Dz</h2>
        </div>
        <div>
          <Link to="/login" className="mr-4 hover:underline">
            Login
          </Link>
          <Link
            to="/signup"
            className="bg-white text-orange-1 px-4 py-2 rounded hover:bg-gray-100"
          >
            Sign Up
          </Link>
        </div>
      </header>

      <section className="text-center py-20 bg-orange-50 flex flex-col gap-5 justify-center items-center">
        <h2 className="text-4xl font-bold mb-4">Level Up Your Coding Daily</h2>
        <p className="text-lg text-gray-600 mb-6">
          Join daily structured lessons on React, Tailwind, and backend tech.
        </p>
        <a
          href="/signup"
          className="bg-orange-1 text-white px-6 py-3 rounded text-lg w-fit"
        >
          Start Learning
        </a>
      </section>
      <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold  mb-16">Why Choose Daily Coding Lessons?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-left">
          <div className="p-8 bg-orange-50 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-2">📅 Daily Lessons</h3>
            <p className="text-gray-600">Get new coding challenges and examples every day to build consistent habits.</p>
          </div>
          <div className="p-8 bg-orange-50 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-2">💻 Real Projects</h3>
            <p className="text-gray-600">Learn by doing. Build real apps using React, Tailwind, Express, and more.</p>
          </div>
          <div className="p-8 bg-orange-50 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-2">📈 Track Progress</h3>
            <p className="text-gray-600">Mark lessons complete and see your growth with streaks and dashboards.</p>
          </div>
          <div className="p-8 bg-orange-50 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-2">🚀 Beginner-Friendly</h3>
            <p className="text-gray-600">Start with basics and move to frameworks like React and Express at your pace.</p>
          </div>
        </div>
      </div>
    </section>
    </div>
  );
}
export default LandingPage