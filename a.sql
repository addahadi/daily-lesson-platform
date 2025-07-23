-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.achievements (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  xp_reward integer DEFAULT 0,
  code text NOT NULL UNIQUE,
  name text NOT NULL,
  description text,
  icon text,
  CONSTRAINT achievements_pkey PRIMARY KEY (id)
);
CREATE TABLE public.courses (
  content jsonb,
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  level text CHECK (level = ANY (ARRAY['beginner'::text, 'intermediate'::text, 'advanced'::text])),
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  is_published boolean DEFAULT false,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  category USER-DEFINED,
  img_url text,
  CONSTRAINT courses_pkey PRIMARY KEY (id)
);
CREATE TABLE public.enrollments (
  user_id text NOT NULL,
  course_id uuid NOT NULL,
  current_module_id uuid,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  completed boolean DEFAULT false,
  enrolled_at timestamp without time zone DEFAULT now(),
  overall_progress integer DEFAULT 0 CHECK (overall_progress >= 0 AND overall_progress <= 100),
  CONSTRAINT enrollments_pkey PRIMARY KEY (id),
  CONSTRAINT enrollments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(clerk_id),
  CONSTRAINT enrollments_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id),
  CONSTRAINT enrollments_current_module_id_fkey FOREIGN KEY (current_module_id) REFERENCES public.modules(id)
);
CREATE TABLE public.lesson_progress (
  enrollment_id uuid NOT NULL,
  module_id uuid NOT NULL,
  lesson_id uuid NOT NULL,
  completed_at timestamp without time zone,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  completed boolean DEFAULT false,
  started_at timestamp without time zone DEFAULT now(),
  CONSTRAINT lesson_progress_pkey PRIMARY KEY (id),
  CONSTRAINT lesson_progress_module_id_fkey FOREIGN KEY (module_id) REFERENCES public.modules(id),
  CONSTRAINT lesson_progress_lesson_id_fkey FOREIGN KEY (lesson_id) REFERENCES public.lessons(id)
);
CREATE TABLE public.lessons (
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  content jsonb,
  duration_minutes integer,
  level text CHECK (level = ANY (ARRAY['beginner'::text, 'intermediate'::text, 'advanced'::text])),
  order_index integer,
  topic_id uuid,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  CONSTRAINT lessons_pkey PRIMARY KEY (id),
  CONSTRAINT lessons_topic_id_fkey FOREIGN KEY (topic_id) REFERENCES public.modules(id)
);
CREATE TABLE public.module_progress (
  enrollment_id uuid NOT NULL,
  module_id uuid NOT NULL,
  completed_at timestamp without time zone,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  started_at timestamp without time zone DEFAULT now(),
  progress integer DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  CONSTRAINT module_progress_pkey PRIMARY KEY (id),
  CONSTRAINT module_progress_module_id_fkey FOREIGN KEY (module_id) REFERENCES public.modules(id)
);
CREATE TABLE public.modules (
  title text NOT NULL,
  order_index integer,
  course_id uuid,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  CONSTRAINT modules_pkey PRIMARY KEY (id),
  CONSTRAINT modules_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id)
);
CREATE TABLE public.notes (
  user_id text NOT NULL,
  content text NOT NULL,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text DEFAULT 'Untitled Note'::text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  lesson_slug text NOT NULL,
  CONSTRAINT notes_pkey PRIMARY KEY (id),
  CONSTRAINT notes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(clerk_id),
  CONSTRAINT notes_lesson_slug_fkey FOREIGN KEY (lesson_slug) REFERENCES public.lessons(slug)
);
CREATE TABLE public.notifications (
  type text NOT NULL CHECK (type = ANY (ARRAY['new_content'::text, 'announcement'::text])),
  title text NOT NULL,
  body text NOT NULL,
  sent_to text NOT NULL CHECK (sent_to = ANY (ARRAY['all_users'::text, 'enrolled_users'::text])),
  content_type text CHECK (content_type = ANY (ARRAY['course'::text, 'module'::text, 'lesson'::text])),
  course_id uuid,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT notifications_pkey PRIMARY KEY (id),
  CONSTRAINT notifications_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id)
);
CREATE TABLE public.quiz_answers (
  user_id text,
  lesson_id uuid,
  quiz_id uuid,
  selected_option_index integer NOT NULL,
  is_correct boolean NOT NULL,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT quiz_answers_pkey PRIMARY KEY (id),
  CONSTRAINT quiz_answers_quiz_id_fkey FOREIGN KEY (quiz_id) REFERENCES public.quizzes(id),
  CONSTRAINT quiz_answers_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(clerk_id),
  CONSTRAINT quiz_answers_lesson_id_fkey FOREIGN KEY (lesson_id) REFERENCES public.lessons(id)
);
CREATE TABLE public.quizzes (
  question text NOT NULL,
  options ARRAY NOT NULL,
  correct_option_index integer NOT NULL,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  lesson_id uuid NOT NULL UNIQUE,
  CONSTRAINT quizzes_pkey PRIMARY KEY (id),
  CONSTRAINT quizzes_lesson_id_fkey FOREIGN KEY (lesson_id) REFERENCES public.lessons(id)
);
CREATE TABLE public.user_achievements (
  unlocked_at timestamp without time zone DEFAULT now(),
  user_id text,
  achievement_id uuid,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  CONSTRAINT user_achievements_pkey PRIMARY KEY (id),
  CONSTRAINT user_achievements_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(clerk_id),
  CONSTRAINT user_achievements_achievement_id_fkey FOREIGN KEY (achievement_id) REFERENCES public.achievements(id)
);
CREATE TABLE public.users (
  role USER-DEFINED,
  status USER-DEFINED NOT NULL DEFAULT 'active'::status,
  level integer DEFAULT 0,
  bio text DEFAULT 'Passionate learner exploring new technologies and expanding my knowledge every day. Currently focusing on web development'::text,
  name text NOT NULL,
  avatar_url text,
  created_at timestamp with time zone DEFAULT now(),
  email text NOT NULL,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  streak_count integer DEFAULT 0,
  last_study_date date,
  clerk_id text NOT NULL UNIQUE,
  xp integer DEFAULT 0,
  CONSTRAINT users_pkey PRIMARY KEY (id)
);
CREATE TABLE public.xp_logs (
  user_id text NOT NULL,
  source text NOT NULL,
  xp_earned integer NOT NULL,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT xp_logs_pkey PRIMARY KEY (id),
  CONSTRAINT xp_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(clerk_id)
);