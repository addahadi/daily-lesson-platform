export interface CourseCardProps {
  id: string;
  title: string;
  category: string;
  level: string;
  guest?: boolean;
  img_url: string;
  slug: string;
  total_duration: string;
  is_saved: boolean;
}
