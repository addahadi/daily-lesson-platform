import type { CourseCardProps } from "@/lib/type";
import CourseCard from "./Discover/CourseCard";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRef } from "react";

const DiscoverSection = ({
  sectionTitle,
  Courses,
}: {
  sectionTitle: string;
  Courses: CourseCardProps[];
}) => {
  const scrollableDiv = useRef<HTMLDivElement>(null);
  function scroll(direction: "Left" | "right") {
    if (scrollableDiv.current) {
      const { clientWidth } = scrollableDiv.current;
      const scrollAmount = clientWidth * 0.8;
      if (direction == "Left") {
        scrollableDiv.current.scrollTo({
          left: scrollableDiv.current.scrollLeft - scrollAmount,
          behavior: "smooth",
        });
      } else if (direction == "right") {
        scrollableDiv.current.scrollTo({
          left: scrollableDiv.current.scrollLeft + scrollAmount,
          behavior: "smooth",
        });
      }
    }
  }
  return (
    <section className="flex flex-col gap-10 ">
      <div className="flex flex-row items-center justify-between  ">
        <h2 className="text-3xl text-black-1 font-semibold">{sectionTitle}</h2>
        <div className="flex flex-row items-center gap-4">
          <div
            className="  cursor-pointer p-1 rounded-full border border-orange-1"
            onClick={() => scroll("Left")}
          >
            <ArrowLeft color="#FF9500" />
          </div>
          <div
            className=" cursor-pointer p-1 rounded-full border border-orange-1"
            onClick={() => scroll("right")}
          >
            <ArrowRight color="#FF9500" />
          </div>
        </div>
      </div>
      <div
        className="flex flex-row gap-5 w-full  overflow-x-auto  scrollbar-hide scroll-smooth "
        ref={scrollableDiv}
      >
        {Courses.map((course) => {
          return <CourseCard {...course} />;
        })}
      </div>
    </section>
  );
};

export default DiscoverSection;
