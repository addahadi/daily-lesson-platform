import { BookOpen, Search, Star, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const EmptyCase = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      {/* Icon */}
      <div className="bg-orange-50 rounded-full p-8 mb-8">
        <BookOpen className="w-16 h-16 text-orange-500" />
      </div>

      {/* Main Content */}
      <div className="text-center max-w-md mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Start Your Learning Journey
        </h2>
        <p className="text-gray-600 text-lg leading-relaxed">
          Discover amazing courses and expand your knowledge. Browse our
          collection of expertly crafted courses to begin learning something new
          today.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mb-12">
        <Link
          to="/dashboard/discover"
          className="inline-flex items-center gap-2 px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition-colors shadow-lg hover:shadow-xl"
        >
          <Search className="w-5 h-5" />
          Browse Courses
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          to="/dashboard/discover?filter=popular"
          className="inline-flex items-center gap-2 px-8 py-4 border-2 border-orange-500 hover:bg-orange-50 text-orange-600 rounded-lg font-semibold transition-colors"
        >
          <Star className="w-5 h-5" />
          Popular Courses
        </Link>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
        <div className="bg-white border border-gray-200 rounded-xl p-6 text-center hover:border-orange-200 transition-colors">
          <div className="bg-blue-50 rounded-full p-3 w-fit mx-auto mb-4">
            <BookOpen className="w-6 h-6 text-blue-500" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Expert Content</h3>
          <p className="text-sm text-gray-600">
            Learn from industry experts with carefully crafted curriculum
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 text-center hover:border-orange-200 transition-colors">
          <div className="bg-green-50 rounded-full p-3 w-fit mx-auto mb-4">
            <Star className="w-6 h-6 text-green-500" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">
            Interactive Learning
          </h3>
          <p className="text-sm text-gray-600">
            Engage with hands-on projects and practical exercises
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 text-center hover:border-orange-200 transition-colors">
          <div className="bg-purple-50 rounded-full p-3 w-fit mx-auto mb-4">
            <ArrowRight className="w-6 h-6 text-purple-500" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">
            Learn at Your Pace
          </h3>
          <p className="text-sm text-gray-600">
            Progress through courses at your own speed and schedule
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmptyCase;
