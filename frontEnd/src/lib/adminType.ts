


export interface UserInfo {
    clerk_id : string
    id : string
    email : string
    status : string
    role : string
    created_at : string
    name : string
    level :string 
    streak_count : string 
    xp : string
}




export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  level: "beginner" | "intermediate" | "advanced";
  slug: string;
  img_url: string;
  modulecount: number;
  lessoncount: number;
  content : string[];
  totalduration: number;
}
  


export interface Module {
  id: string;
  title: string;
  order_index: number;
  lessoncount: number;
  totalduration: number;
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  duration_minutes: number;
  description : string
  level: "beginner" | "intermediate" | "hard";
  slug: string;
  order_index: number;
}

export type section  = {heading : string , code : string , id : string} | {heading : string , text : string , id : string}


export interface NotificationType {
  id: string
  type: string
  title: string
  body: string
  created_at: string
  sent_to: string
  course_id : string | null
  content_type : string | null
}

