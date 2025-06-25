




export interface CourseCardProps  {
    title : string
    category : string
    level : string 
    guest? : boolean
    img_url : string
    slug : string
    content : string[]
}


export interface ModuleCardProps {
  title: string;
  created_at: string;
  order_index: string;
  module_id: string;
}

export type LessonSectionProps  = {
  text : string 
  heading : string
} | {
  code : string 
  heading : string
} | {
  bullets : string[]
  heading : string
}



export interface LessonCardProps {
  lesson_id: string;
  title: string;
  lesson_slug: string;
  duration_minutes: string;
  level: string;
  order_index? : string
}

export default interface QuizzProps {
  options : string[]
  question : string 
  correct_option_index : string
}


export type Lesson = Pick<LessonCardProps, "title" | "order_index"> & {slug : string};

export interface LessonBarProps {
  course: Pick<CourseCardProps, "title" | "slug">;
  modules: Array<ModuleCardProps & { lessons: Lesson[] }>;
}

export interface CourseProps extends CourseCardProps{
    description : string , 
    id : string, 
    total : string
}

export interface ToastProps {
    type: "success" | "error" | "info";
    message: string;
}