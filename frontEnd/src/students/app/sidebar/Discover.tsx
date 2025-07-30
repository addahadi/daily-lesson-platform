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
import CourseCard from "@/students/components/Discover/CourseCard";
import EmptySearch from "@/students/components/empty/EmptySearch";
import LoadingSpinner from "@/components/ui/loading";
import { getCach, setCache } from "@/lib/utils";
import { CACHE_KEY_DISCOVER } from "@/lib/utils";

const TTL = 1000 * 60 * 60;

const Discover = () => {
  const [CourseCardData, setCourseCardData] = useState<CourseCardProps[]>([]);
  const [filter, setFilter] = useState(false);
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [loading, setLoading] = useState(false);
  const [noCourses, setNoCourses] = useState(false);
  const { getAllCourses, getFilteredCourses } = useCourseApiController();

  useEffect(() => {
    async function fetchCourses() {
      setLoading(true);

      const cached = getCach(CACHE_KEY_DISCOVER);
      if (cached) {
        setCourseCardData(cached);
        console.log(CourseCardData);

        setLoading(false);
        return;
      }
      const result = await getAllCourses();
      if (result === null || result === undefined) setNoCourses(true);
      else {
        setCache(CACHE_KEY_DISCOVER, result, TTL);
        setCourseCardData(result);
      }

      setLoading(false);
    }
    fetchCourses();
  }, []);

  useEffect(() => {
    if (!category && !difficulty) return;
    setNoCourses(false);
    const fetchData = async () => {
      console.log(category, difficulty);
      const query = new URLSearchParams({
        difficulty,
        category,
      });
      setLoading(true);
      const result = await getFilteredCourses(query);
      setLoading(false);
      if (result === null || result === undefined) {
        setNoCourses(true);
      } else setCourseCardData(result);
      console.log(result);
    };
    fetchData();
  }, [category, difficulty]);

  return (
    <div className="p-0 min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
      {/* Header Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-col justify-center gap-5 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className=" w-full">
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
                onValueChange={(value) => {
                  console.log(difficulty);
                  setDifficulty(value);
                }}
                value={difficulty}
              >
                <SelectTrigger className="w-full sm:w-[180px] border-black-1 dark:border-gray-600 dark:bg-gray-800 dark:text-white py-2 rounded-lg">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                  <SelectItem
                    value="beginner"
                    className="dark:text-white dark:hover:bg-gray-700"
                  >
                    Beginner
                  </SelectItem>
                  <SelectItem
                    value="intermediate"
                    className="dark:text-white dark:hover:bg-gray-700"
                  >
                    Intermediate
                  </SelectItem>
                  <SelectItem
                    value="hard"
                    className="dark:text-white dark:hover:bg-gray-700"
                  >
                    Hard
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {filter && (
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm rounded-lg mt-4 transition-all duration-300">
              <div className="w-full mx-auto px-4 sm:px-6 py-6">
                <div>
                  <label className="text-md font-medium text-gray-700 dark:text-gray-300 flex flex-col">
                    <span className="mb-4">Category</span>
                    <Select
                      onValueChange={(value) => {
                        console.log(category);
                        setCategory(value);
                      }}
                      value={category}
                    >
                      <SelectTrigger className="w-full border-black-1 dark:border-gray-600 dark:bg-gray-700 dark:text-white py-2 rounded-lg">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                        <SelectItem
                          value="frontend"
                          className="dark:text-white dark:hover:bg-gray-700"
                        >
                          FrontEnd
                        </SelectItem>
                        <SelectItem
                          value="backend"
                          className="dark:text-white dark:hover:bg-gray-700"
                        >
                          BackEnd
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div>
          <h1 className="font-semibold text-xl sm:text-2xl text-gray-900 dark:text-white mb-6">
            {loading
              ? "Loading Courses..."
              : `${CourseCardData.length} Courses Found`}
          </h1>

          {loading ? (
            <div className="flex justify-center items-center h-32">
              <LoadingSpinner size={40} />
            </div>
          ) : noCourses ? (
            <EmptySearch />
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2  gap-4 sm:gap-6">
              {CourseCardData.map((course) => (
                <CourseCard key={course.id} {...course} deleteState={false} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Discover;
