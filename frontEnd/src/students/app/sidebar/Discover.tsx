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


const TTL = 1000*60*60

const Discover = () => {
  const [CourseCardData, setCourseCardData] = useState<CourseCardProps[]>([]);
  const [filter, setFilter] = useState(false);
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [loading, setLoading] = useState(false);
  const [noCourses, setNoCourses] = useState(false);
  const {getAllCourses , getFilteredCourses} = useCourseApiController()

  useEffect(() => {
    async function fetchCourses() {
      setLoading(true);

      const cached = getCach(CACHE_KEY_DISCOVER)
      if(cached){
        setCourseCardData(cached)
        console.log(CourseCardData)  

        setLoading(false)
        return 
      }
      const result = await getAllCourses();
      if (result === null || result === undefined) setNoCourses(true);
      else {
        setCache(CACHE_KEY_DISCOVER , result , TTL)  
        setCourseCardData(result)
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
    <div className=" p-0">
      <section className="px-4 py-6 flex flex-col justify-center gap-5 bg-white">
        <h1 className=" text-black-1 text-3xl font-semibold">
          Discover Amazing Courses
        </h1>
        <p className=" text-lg text-gray-400">
          Learn new skills and advance your career with our expert-led courses
        </p>
        <Input placeholder="Search Courses" />

        <div className=" justify-start flex items-center gap-3">
          <Button
            className=" text-black-1 bg-slate-300"
            variant="default"
            onClick={() => setFilter(!filter)}
          >
            <Filter className=" w-5 h-5 text-black-1" />
            <span>Filters</span>
          </Button>
          <div>
            <Select
              onValueChange={(value) => {
                console.log(difficulty);
                setDifficulty(value);
              }}
              value={difficulty}
            >
              <SelectTrigger className="w-[180px] border-black-1  py-2 rounded-lg">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        {filter && (
          <div className="bg-white border-b border-gray-200 shadow-sm">
            <div className=" w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div>
                <label className=" text-md font-medium text-gray-700 flex flex-col ">
                  <span className=" mb-4">Category</span>
                  <Select
                    onValueChange={(value) => {
                      console.log(category);
                      setCategory(value);
                    }}
                    value={category}
                  >
                    <SelectTrigger className=" w-full  border-black-1  py-2 rounded-lg">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="frontend">FrontEnd</SelectItem>
                      <SelectItem value="backend">BackEnd</SelectItem>
                    </SelectContent>
                  </Select>
                </label>
              </div>
            </div>
          </div>
        )}
      </section>
      <section className="p-6 flex flex-col gap-8">
        <h1 className="font-semibold text-2xl">
          {loading
            ? "Loading Courses..."
            : `${CourseCardData.length} Courses Found`}
        </h1>

        {loading ? (
          <div className="flex justify-center items-center h-32">
            <LoadingSpinner  size={40} />
          </div>
        ) : noCourses ? (
          <EmptySearch />
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {CourseCardData.map((course) => (
              <CourseCard key={course.id} {...course} deleteState={false}/>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Discover;
