import { handleResponse } from "../utils/util"


async function getAllCourses() {
    try {
        const response = await fetch("https://daily-lesson-platform.onrender.com/public/courses", {
            method : "GET"
        })
        const data = await  handleResponse<{
            id : string 
            slug : string
        }[]>(response)
        if(typeof data === "string"){
            console.error("Error fetching courses:", data);
            return null
        }
        return data.data;
    }
    catch(err : any){
        console.error("Error fetching courses:", err.message);
        return null
    }
}

async function getCourseInfoBySlug(slug: string) {
    try {
        const response = await fetch(`https://daily-lesson-platform.onrender.com/public/courses/${slug}`, {
            method: "GET"
        });
        const data = await handleResponse<{
          course: {
            id: string;
            title: string;
            level: string;
            category: string;
            description: string;
            img_url: string;
            slug: string;
            total_duration: number;
            total_modules: number;
          };
          courseInfo: {
            modules: Array<{
              id: string;
              title: string;
              order_index: number;
              created_at: string;
              lessons: Array<{
                id: string;
                title: string;
                slug: string;
                topic_id: string;
                duration_minutes: number;
              }>;
            }>;
          };
        }>(response);
        if (typeof data === "string") {
            console.error("Error fetching course:", data);
            return null;
        }
        return data.data;
    } catch (err: any) {
        console.error("Error fetching course:", err.message);
        return null;
    }

}

async function getFeaturedCourses() {
    try {
        const response = await fetch("https://daily-lesson-platform.onrender.com/public/courses/featured", {
            method: "GET"
        });
        console.log(response)
        const data = await handleResponse<{
            title: string;
            description: string;
            slug: string;
            img_url: string;
        }[]>(response);
        if (typeof data === "string") {
            console.error("Error fetching featured courses:", data);
            return null;
        }
        return data.data;
    } catch (err: any) {
        console.error("Error fetching featured courses:", err.message);
        return null;
    }
}

export {getAllCourses , getCourseInfoBySlug , getFeaturedCourses}