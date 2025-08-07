-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.achievements (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  name text NOT NULL,
  description text,
  icon text,
  xp_reward integer DEFAULT 0,
  CONSTRAINT achievements_pkey PRIMARY KEY (id)
);
CREATE TABLE public.course_save (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL,
  folder_id uuid NOT NULL,
  saved_at timestamp without time zone NOT NULL DEFAULT now(),
  CONSTRAINT course_save_pkey PRIMARY KEY (id),
  CONSTRAINT course_save_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id),
  CONSTRAINT course_save_folder_id_fkey FOREIGN KEY (folder_id) REFERENCES public.folders(id)
);
CREATE TABLE public.courses (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  level text CHECK (level = ANY (ARRAY['beginner'::text, 'intermediate'::text, 'advanced'::text])),
  is_published boolean DEFAULT false,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  category USER-DEFINED,
  img_url text,
  content jsonb,
  CONSTRAINT courses_pkey PRIMARY KEY (id)
);
CREATE TABLE public.enrollments (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  course_id uuid NOT NULL,
  current_module_id uuid,
  completed boolean DEFAULT false,
  enrolled_at timestamp without time zone DEFAULT now(),
  overall_progress integer DEFAULT 0 CHECK (overall_progress >= 0 AND overall_progress <= 100),
  CONSTRAINT enrollments_pkey PRIMARY KEY (id),
  CONSTRAINT enrollments_current_module_id_fkey FOREIGN KEY (current_module_id) REFERENCES public.modules(id),
  CONSTRAINT enrollments_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id),
  CONSTRAINT enrollments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(clerk_id)
);
CREATE TABLE public.folders (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  title text NOT NULL DEFAULT 'Undefined'::text,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT folders_pkey PRIMARY KEY (id),
  CONSTRAINT folders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(clerk_id)
);
CREATE TABLE public.lesson_progress (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  enrollment_id uuid NOT NULL,
  module_id uuid NOT NULL,
  lesson_id uuid NOT NULL,
  completed boolean DEFAULT false,
  started_at timestamp without time zone DEFAULT now(),
  completed_at timestamp without time zone,
  CONSTRAINT lesson_progress_pkey PRIMARY KEY (id),
  CONSTRAINT lesson_progress_module_id_fkey FOREIGN KEY (module_id) REFERENCES public.modules(id),
  CONSTRAINT lesson_progress_lesson_id_fkey FOREIGN KEY (lesson_id) REFERENCES public.lessons(id)
);
CREATE TABLE public.lessons (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  content jsonb,
  duration_minutes integer,
  level text CHECK (level = ANY (ARRAY['beginner'::text, 'intermediate'::text, 'advanced'::text])),
  order_index integer,
  topic_id uuid,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  is_deleted boolean DEFAULT false,
  CONSTRAINT lessons_pkey PRIMARY KEY (id),
  CONSTRAINT lessons_topic_id_fkey FOREIGN KEY (topic_id) REFERENCES public.modules(id)
);
CREATE TABLE public.module_progress (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  enrollment_id uuid NOT NULL,
  module_id uuid NOT NULL,
  started_at timestamp without time zone DEFAULT now(),
  completed_at timestamp without time zone,
  progress integer DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  CONSTRAINT module_progress_pkey PRIMARY KEY (id),
  CONSTRAINT module_progress_module_id_fkey FOREIGN KEY (module_id) REFERENCES public.modules(id)
);
CREATE TABLE public.modules (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  order_index integer,
  course_id uuid,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  is_deleted boolean DEFAULT false,
  CONSTRAINT modules_pkey PRIMARY KEY (id),
  CONSTRAINT modules_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id)
);
CREATE TABLE public.notes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  lesson_slug text NOT NULL,
  user_id text NOT NULL,
  title text DEFAULT 'Untitled Note'::text,
  content text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT notes_pkey PRIMARY KEY (id),
  CONSTRAINT notes_lesson_slug_fkey FOREIGN KEY (lesson_slug) REFERENCES public.lessons(slug),
  CONSTRAINT notes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(clerk_id)
);
CREATE TABLE public.notifications (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type = ANY (ARRAY['new_content'::text, 'announcement'::text])),
  title text NOT NULL,
  body text NOT NULL,
  sent_to text NOT NULL CHECK (sent_to = ANY (ARRAY['all_users'::text, 'enrolled_users'::text])),
  content_type text CHECK (content_type = ANY (ARRAY['course'::text, 'module'::text, 'lesson'::text])),
  course_id uuid,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT notifications_pkey PRIMARY KEY (id),
  CONSTRAINT notifications_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id)
);
CREATE TABLE public.quiz_answers (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id text,
  lesson_id uuid,
  quiz_id uuid,
  selected_option_index integer NOT NULL,
  is_correct boolean NOT NULL,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT quiz_answers_pkey PRIMARY KEY (id),
  CONSTRAINT quiz_answers_lesson_id_fkey FOREIGN KEY (lesson_id) REFERENCES public.lessons(id),
  CONSTRAINT quiz_answers_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(clerk_id),
  CONSTRAINT quiz_answers_quiz_id_fkey FOREIGN KEY (quiz_id) REFERENCES public.quizzes(id)
);
CREATE TABLE public.quizzes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  lesson_id uuid NOT NULL UNIQUE,
  question text NOT NULL,
  options ARRAY NOT NULL,
  correct_option_index integer NOT NULL,
  CONSTRAINT quizzes_pkey PRIMARY KEY (id),
  CONSTRAINT quizzes_lesson_id_fkey FOREIGN KEY (lesson_id) REFERENCES public.lessons(id)
);
CREATE TABLE public.user_achievements (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id text,
  achievement_id uuid,
  unlocked_at timestamp without time zone DEFAULT now(),
  CONSTRAINT user_achievements_pkey PRIMARY KEY (id),
  CONSTRAINT user_achievements_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(clerk_id),
  CONSTRAINT user_achievements_achievement_id_fkey FOREIGN KEY (achievement_id) REFERENCES public.achievements(id)
);
CREATE TABLE public.user_notification (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  notification_id uuid NOT NULL,
  user_id text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamp without time zone NOT NULL DEFAULT now(),
  CONSTRAINT user_notification_pkey PRIMARY KEY (id),
  CONSTRAINT user_notification_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(clerk_id),
  CONSTRAINT user_notification_notification_id_fkey FOREIGN KEY (notification_id) REFERENCES public.notifications(id)
);
CREATE TABLE public.users (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  avatar_url text,
  created_at timestamp with time zone DEFAULT now(),
  email text NOT NULL,
  clerk_id text NOT NULL UNIQUE,
  streak_count integer DEFAULT 0,
  last_study_date date,
  xp integer DEFAULT 0,
  level integer DEFAULT 0,
  bio text DEFAULT 'Passionate learner exploring new technologies and expanding my knowledge every day. Currently focusing on web development'::text,
  role USER-DEFINED,
  status USER-DEFINED NOT NULL DEFAULT 'active'::status,
  CONSTRAINT users_pkey PRIMARY KEY (id)
);
CREATE TABLE public.xp_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  source text NOT NULL,
  xp_earned integer NOT NULL,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT xp_logs_pkey PRIMARY KEY (id),
  CONSTRAINT xp_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(clerk_id)
);