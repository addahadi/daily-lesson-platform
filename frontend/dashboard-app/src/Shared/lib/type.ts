




export interface CourseCardProps {
  slug: string;
  title: string;
  category: string;
  level: string;
  img_url: string;
  total_duration: string;
  id: string;
  completed_course : boolean;
  is_saved?: boolean;
}

export type XpData = {
  xp_per_day: number;
  day: string;
};


export interface NotificationData {
  id : string 
  type : string 
  title : string
  body : string
  created_at : string
  content_type : null | string
  course_id : null | string
  is_read : boolean
}
export interface achievementsProps {
  code: string
  description: string
  earned: boolean
  icon: string 
  name: string
  id : string
}


export interface UserInfoProps {
  avatar_url : string
  bio : string 
  created_at : string
  xp : number 
  streak_count : number
  level : number
  name : string
}

export type FolderType = {
  id: string;
  title: string;
  created_at: string;
};

export type CourseSave = {
  id: string;
  course_id: string;
  folder_id: string;
  saved_at: string;
};



export  interface notesProps {
  note_title : string
  lesson_title : string
  content  : string
  created_at : string
  course_slug : string 
  topic_id : string 
  lesson_slug : string
}


export interface ModuleCardProps {
  title: string;
  created_at: string;
  order_index: string;
  module_id: string;
  isAccessible: boolean;
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
  slug: string;
  duration_minutes: string;
  level: string;
  order_index? : string
}



export type EnrolledLessons = ({
  lesson: Pick<LessonCardProps, "duration_minutes" | "level" | "slug"> & Pick<ModuleCardProps, "module_id"> & {
    module_title: string;
    lesson_title : string
  };
} & {
  progressPercentage: string;
  total_modules : string
  total_progressed_modules : string
});

export interface QuizzProps {
  quizz_id : string
  options : string[]
  question : string 
  correct_option_index : number
  selected_option_index? : number
  is_correct? : boolean
}


export type Lesson = Pick<LessonCardProps, "title" | "order_index"> & {slug : string , completed : boolean};

export type LessonDataType = LessonCardProps & {content: {sections :LessonSectionProps[]}} & {quizz : QuizzProps|null} & {
  previous : boolean
  next : boolean
}
export interface LessonBarProps {
  course: Pick<CourseCardProps, "title" | "slug">;
  modules: Array<ModuleCardProps & { lessons: Lesson[] }>;
}

export interface CourseProps extends CourseCardProps{
  content : string[]
  total_modules : number
  description : string
}

export interface ToastProps {
    type: "success" | "error" | "info";
    message: string;
}