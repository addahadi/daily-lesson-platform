import useCourseApiController from "@/students/Api/course.Api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { CourseCardProps } from "@/lib/type";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter } from "lucide-react";
import { useEffect, useState } from "react";
import CourseCard from "../components/Discover/CourseCard";
import EmptySearch from "@/components/empty/EmptySearch";
import LoadingSpinner from "@/components/ui/loading";
import { getCach, setCache } from "@/lib/utils";
import { CACHE_KEY_DISCOVER } from "@/lib/utils";
import FilteredCourseList from "../components/Discover/FilteredCourseList";

const TTL = 1000 * 60 * 60;

const Discover = () => {
  const [CourseCardData, setCourseCardData] = useState<CourseCardProps[]>([]);
  const [filter, setFilter] = useState(false);
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [loading, setLoading] = useState(false);
  const [noCourses, setNoCourses] = useState(false);
  const { getAllCourses } = useCourseApiController();
  const [page, setPage] = useState(1);
  const [isshowMore, setIsShowMore] = useState(false);
  const [showMoreLoading, setShowMoreLoading] = useState(false);

  // Default discover list with caching
  useEffect(() => {
    if (category || difficulty) return; // skip if filter is active

    async function fetchCourses() {
      setLoading(true);
      const cached = getCach(CACHE_KEY_DISCOVER);
      if (cached) {
        setPage(cached.page);
        setCourseCardData(cached.courses);
        setIsShowMore(cached.final);
        setLoading(false);
        return;
      }

      const result = await getAllCourses(1);
      if (!result?.data) {
        setNoCourses(true);
        setLoading(false);
        return;
      }

      setCache(
        CACHE_KEY_DISCOVER,
        {
          courses: result.data,
          page: page + 1,
          final: result.final,
        },
        TTL
      );

      setCourseCardData(result.data);
      setIsShowMore(result.final as boolean);
      setPage(page + 1);
      setLoading(false);
    }

    fetchCourses();
  }, [category, difficulty]);

  async function showMoreCourses() {
    setShowMoreLoading(true);
    const result = await getAllCourses(page);
    if (!result?.data) {
      setShowMoreLoading(false);
      return;
    }
    const cached = getCach(CACHE_KEY_DISCOVER);
    setCache(
      CACHE_KEY_DISCOVER,
      {
        courses: [...(cached?.courses || []), ...result.data],
        page: page + 1,
        final: result.final,
      },
      TTL
    );
    setCourseCardData((prev) => [...prev, ...result.data as CourseCardProps[]]);
    setIsShowMore(result.final as boolean);
    setPage((prev) => prev + 1);
    setShowMoreLoading(false);
  }

  return (
    <div className="p-0 min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
      {/* Header Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-col justify-center gap-5 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="w-full">
          <h1 className="text-black-1 dark:text-white text-2xl sm:text-3xl lg:text-4xl font-semibold">
            Discover Amazing Courses
          </h1>
          <p className="text-base sm:text-lg text-gray-400 dark:text-gray-300 mt-2">
            Learn new skills and advance your career with our expert-led courses
          </p>

          {/* Search Input */}
          <div className="mt-6">
            <Input
              placeholder="Search Courses"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full max-w-md dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-400"
            />
          </div>

          {/* Filter Controls */}
          <div className="flex flex-col sm:flex-row justify-start items-start sm:items-center gap-3 mt-6">
            <Button
              className="text-black-1 dark:text-gray-900 bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500 transition-colors duration-200"
              variant="default"
              onClick={() => setFilter(!filter)}
            >
              <Filter className="w-5 h-5 text-black-1 dark:text-gray-900 mr-2" />
              <span>Filters</span>
            </Button>

            <div className="w-full sm:w-auto">
              <Select
                onValueChange={(value) => setDifficulty(value)}
                value={difficulty}
              >
                <SelectTrigger className="w-full sm:w-[180px] border-black-1 dark:border-gray-600 dark:bg-gray-800 dark:text-white py-2 rounded-lg">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {filter && (
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm rounded-lg mt-4 transition-all duration-300">
              <div className="w-full mx-auto px-4 sm:px-6 py-6">
                <label className="text-md font-medium text-gray-700 dark:text-gray-300 flex flex-col">
                  <span className="mb-4">Category</span>
                  <Select
                    onValueChange={(value) => setCategory(value)}
                    value={category}
                  >
                    <SelectTrigger className="w-full border-black-1 dark:border-gray-600 dark:bg-gray-700 dark:text-white py-2 rounded-lg">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                      <SelectItem value="frontend">FrontEnd</SelectItem>
                      <SelectItem value="backend">BackEnd</SelectItem>
                    </SelectContent>
                  </Select>
                </label>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {category || difficulty || search ? (
          <FilteredCourseList
            category={category}
            difficulty={difficulty}
            search={search}
          />
        ) : (
          <div>
            <h1 className="font-semibold text-xl sm:text-2xl text-gray-900 dark:text-white mb-6">
              {loading
                ? "Loading Courses..."
                : `${CourseCardData?.length} Courses Found`}
            </h1>

            {loading ? (
              <div className="flex justify-center items-center h-32">
                <LoadingSpinner size={40} />
              </div>
            ) : noCourses ? (
              <EmptySearch />
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
                {CourseCardData.map((course) => (
                  <CourseCard
                    key={course.id}
                    {...course}
                    is_saved={course.is_saved as boolean}
                    deleteState={false}
                  />
                ))}
              </div>
            )}

            {isshowMore && (
              <div className="flex justify-center mt-8">
                <Button
                  disabled={showMoreLoading}
                  onClick={showMoreCourses}
                  className="bg-orange-600 text-white hover:bg-orange-700 transition-colors duration-200"
                >
                  Show More
                </Button>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default Discover;
