


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
  difficulty: "beginner" | "intermediate" | "advanced";
  slug: string;
  img: string;
  moduleCount: number;
  lessonCount: number;
  totalDuration: number;
}
  