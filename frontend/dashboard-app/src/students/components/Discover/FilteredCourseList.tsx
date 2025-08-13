import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/ui/loading";
import EmptySearch from "@/components/empty/EmptySearch";
import type { CourseCardProps } from "@/lib/type";
import useCourseApiController from "@/students/Api/course.Api";
import CourseCard from "./CourseCard";

interface FilteredCourseListProps {
  category: string;
  difficulty: string;
  search: string;
}

const FilteredCourseList = ({
  category,
  difficulty,
  search,
}: FilteredCourseListProps) => {
  const { getFilteredCourses } = useCourseApiController();
  const [courses, setCourses] = useState<CourseCardProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [showMore, setShowMore] = useState(false);
  const [showMoreLoading, setShowMoreLoading] = useState(false);
  const [noCourses, setNoCourses] = useState(false);

  useEffect(() => {
    if (!category && !difficulty && !search) return;

    setPage(1);
    setCourses([]);
    setNoCourses(false);

    const fetchData = async () => {
      setLoading(true);
      const query = new URLSearchParams({
        category,
        difficulty,
        search,
        page: "1",
      });
      const result = await getFilteredCourses(query);
      setLoading(false);

      if (!result?.data || result.data.length === 0) {
        setNoCourses(true);
        return;
      }

      setCourses(result.data);
      setShowMore(result.final as boolean);
    };

    fetchData();
  }, [category, difficulty, search]);

  async function loadMore() {
    setShowMoreLoading(true);
    const query = new URLSearchParams({
      category,
      difficulty,
      search,
      page: String(page + 1),
    });
    const result = await getFilteredCourses(query);
    setShowMoreLoading(false);
    if (!result) return;
    setCourses((prev) => [...prev, ...result.data as CourseCardProps[]]);
    setShowMore(result.final as boolean);
    setPage((prev) => prev + 1);
  }

  return (
    <div>
      <h1 className="font-semibold text-xl sm:text-2xl text-gray-900 dark:text-white mb-6">
        {loading ? "Loading Courses..." : `${courses.length} Courses Found`}
      </h1>

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <LoadingSpinner size={40} />
        </div>
      ) : noCourses ? (
        <EmptySearch />
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              {...course}
              is_saved={course.is_saved as boolean}
              deleteState={false}
            />
          ))}
        </div>
      )}

      {showMore && (
        <div className="flex justify-center mt-8">
          <Button
            disabled={showMoreLoading}
            onClick={loadMore}
            className="bg-orange-600 text-white hover:bg-orange-700 transition-colors duration-200"
          >
            Show More
          </Button>
        </div>
      )}
    </div>
  );
};

export default FilteredCourseList;
