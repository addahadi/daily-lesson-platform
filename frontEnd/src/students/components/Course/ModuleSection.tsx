
import type { ModuleCardProps } from "@/lib/type";
import { useEffect, useState } from "react";
import Modules from "./Module";
import useCourseApiController from "@/students/Api/course.Api";

const ModuleSection = ({ Course_Id }: { Course_Id: string }) => {
  const [modules, setModules] = useState<ModuleCardProps[]>([]);
  const {getCourseModules} = useCourseApiController()
  useEffect(() => {
    async function fetchModules() {
      if (Course_Id) {
        const result = await getCourseModules(Course_Id);
        if (result) {
          console.log(result);
          setModules(result);
        }
      }
    }
    fetchModules();
  }, [Course_Id]);

  return (
    <section className="w-full p-6 mt-10 mb-14">
      <h2 className="text-xl font-semibold  text-black-1">Modules</h2>
      <div className=" w-full rounded-2xl border border-gray-300 bg-white-1 mt-10">
        {modules.map((module) => {
          return <Modules {...module} />;
        })}
      </div>
    </section>
  );
};

export default ModuleSection;
