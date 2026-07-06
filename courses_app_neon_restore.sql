-- Extracted public schema (DiagInfect-unrelated courses app) for Neon restore
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

--
-- Name: category; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.category AS ENUM (
    'Frontend',
    'Backend',
    'Fullstack',
    'Mobile Development',
    'Data Science & AI',
    'DevOps & Cloud',
    'Cybersecurity',
    'Game Development'
);



--
-- Name: level; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.level AS ENUM (
    'beginner',
    'intermediate',
    'advanced'
);



--
-- Name: role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.role AS ENUM (
    'student',
    'admin'
);



--
-- Name: status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.status AS ENUM (
    'active',
    'inactive'
);



--
-- Name: reset_user_streaks(date, date); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.reset_user_streaks(today date, yesterday date) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  UPDATE users
  SET streak_count = 0
  WHERE last_study_date IS DISTINCT FROM yesterday
    AND last_study_date IS DISTINCT FROM today;
END;
$$;



--
-- Name: achievements; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.achievements (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    code text NOT NULL,
    name text NOT NULL,
    description text,
    icon text,
    xp_reward integer DEFAULT 0
);



--
-- Name: course_save; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.course_save (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    course_id uuid NOT NULL,
    folder_id uuid NOT NULL,
    saved_at timestamp without time zone DEFAULT now() NOT NULL
);



--
-- Name: courses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.courses (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    description text,
    level text,
    is_published boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    category public.category,
    img_url text,
    content jsonb,
    CONSTRAINT courses_level_check CHECK ((level = ANY (ARRAY['beginner'::text, 'intermediate'::text, 'advanced'::text])))
);



--
-- Name: enrollments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.enrollments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id text NOT NULL,
    course_id uuid NOT NULL,
    current_module_id uuid,
    completed boolean DEFAULT false,
    enrolled_at timestamp without time zone DEFAULT now(),
    overall_progress integer DEFAULT 0,
    CONSTRAINT enrollments_overall_progress_check CHECK (((overall_progress >= 0) AND (overall_progress <= 100)))
);



--
-- Name: folders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.folders (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id text NOT NULL,
    title text DEFAULT 'Undefined'::text NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);



--
-- Name: lesson_progress; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lesson_progress (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    enrollment_id uuid NOT NULL,
    module_id uuid NOT NULL,
    lesson_id uuid NOT NULL,
    completed boolean DEFAULT false,
    started_at timestamp without time zone DEFAULT now(),
    completed_at timestamp without time zone
);



--
-- Name: lessons; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lessons (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    description text,
    content jsonb,
    duration_minutes integer,
    level text,
    order_index integer,
    topic_id uuid,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    is_deleted boolean DEFAULT false,
    CONSTRAINT lessons_level_check CHECK ((level = ANY (ARRAY['beginner'::text, 'intermediate'::text, 'advanced'::text])))
);



--
-- Name: module_progress; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.module_progress (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    enrollment_id uuid NOT NULL,
    module_id uuid NOT NULL,
    started_at timestamp without time zone DEFAULT now(),
    completed_at timestamp without time zone,
    progress integer DEFAULT 0,
    CONSTRAINT module_progress_progress_check CHECK (((progress >= 0) AND (progress <= 100)))
);



--
-- Name: modules; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.modules (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    order_index integer,
    course_id uuid,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    is_deleted boolean DEFAULT false
);



--
-- Name: notes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    lesson_slug text NOT NULL,
    user_id text NOT NULL,
    title text DEFAULT 'Untitled Note'::text,
    content text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);



--
-- Name: notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notifications (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    type text NOT NULL,
    title text NOT NULL,
    body text NOT NULL,
    sent_to text NOT NULL,
    content_type text,
    course_id uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT notifications_content_type_check CHECK ((content_type = ANY (ARRAY['course'::text, 'module'::text, 'lesson'::text]))),
    CONSTRAINT notifications_sent_to_check CHECK ((sent_to = ANY (ARRAY['all_users'::text, 'enrolled_users'::text]))),
    CONSTRAINT notifications_type_check CHECK ((type = ANY (ARRAY['new_content'::text, 'announcement'::text])))
);



--
-- Name: quiz_answers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.quiz_answers (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id text,
    lesson_id uuid,
    quiz_id uuid,
    selected_option_index integer NOT NULL,
    is_correct boolean NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);



--
-- Name: quizzes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.quizzes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    lesson_id uuid NOT NULL,
    question text NOT NULL,
    options text[] NOT NULL,
    correct_option_index integer NOT NULL
);



--
-- Name: user_achievements; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_achievements (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id text,
    achievement_id uuid,
    unlocked_at timestamp without time zone DEFAULT now()
);



--
-- Name: user_notification; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_notification (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    notification_id uuid NOT NULL,
    user_id text NOT NULL,
    is_read boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);



--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    avatar_url text,
    created_at timestamp with time zone DEFAULT now(),
    email text NOT NULL,
    clerk_id text NOT NULL,
    streak_count integer DEFAULT 0,
    last_study_date date,
    xp integer DEFAULT 0,
    level integer DEFAULT 0,
    bio text DEFAULT 'Passionate learner exploring new technologies and expanding my knowledge every day. Currently focusing on web development'::text,
    role public.role,
    status public.status DEFAULT 'active'::public.status NOT NULL
);



--
-- Name: xp_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.xp_logs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id text NOT NULL,
    source text NOT NULL,
    xp_earned integer NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);



--
-- Data for Name: achievements; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.achievements (id, code, name, description, icon, xp_reward) FROM stdin;
a2caa9ad-d8eb-4d59-8168-8375df9aa58b	first_lesson	First Step	Complete your first lesson.	👣	20
f1fa74b7-fac9-4aec-85bd-03d406395893	ten_lessons	Learning Machine	Complete 10 lessons.	📚	50
d40a741a-e3a9-4694-a498-68749077b509	five_quizzes	Quiz Challenger	Complete 5 quizzes.	📝	30
5dd7fae0-8e7a-4ee4-bfb9-df24d5f13344	three_day_streak	Consistent Learner	Complete a lesson 3 days in a row.	🔥	40
fc234953-49b4-45b3-96b7-fa6f79e5dab3	level_5	Level Up!	Reach Level 5 by earning XP.	🚀	60
\.


--
-- Data for Name: course_save; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.course_save (id, course_id, folder_id, saved_at) FROM stdin;
f41eaa67-ecb9-4fc8-8988-69d34fc89b75	2e83570e-1ead-44d9-927f-932d1c84e4af	3d1ae946-26c2-4aef-8189-ddc0a36636b1	2025-09-03 20:21:30.316118
\.


--
-- Data for Name: courses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.courses (id, title, slug, description, level, is_published, created_at, updated_at, category, img_url, content) FROM stdin;
375b53dd-f12e-4402-957f-e6400136f6e5	Node.js & Express Backend Development	node-express-backend	Master backend development with Node.js and Express. Learn REST APIs, authentication, databases, and deployment.	beginner	t	2025-09-03 13:26:01.022687	2025-09-03 13:26:01.022687	Backend	https://res.cloudinary.com/duw0bz1md/image/upload/v1756905689/walkator-klMii3cR9iI-unsplash_oowuih.jpg	["Perfect starting point for backend development", "Learn to build and secure REST APIs", "Work with databases like PostgreSQL and MongoDB", "Implement authentication and authorization", "Deploy applications to production"]
e69ca435-deaf-4603-a97b-e6375ba68773	Practical AI with Python	practical-ai-python	An introduction to AI & machine learning with Python. Learn data preprocessing, model training, and real-world AI applications.	intermediate	t	2025-09-03 13:26:01.022687	2025-09-03 13:26:01.022687	Data Science & AI	https://res.cloudinary.com/duw0bz1md/image/upload/v1756905931/deng-xiang--WXQm_NTK0U-unsplash_dfvvvh.jpg	["Beginner-friendly introduction to AI & ML", "Covers essential Python libraries like NumPy, Pandas, and PyTorch", "Step-by-step model building process", "Real-world AI project to showcase your skills", "Learn how to apply AI in practical scenarios"]
2e83570e-1ead-44d9-927f-932d1c84e4af	React.js Mastery: Build Modern Web Apps	react-js-mastery	Learn React.js from the ground up with hands-on projects. This course covers components, hooks, state management, and performance optimization.	intermediate	t	2025-09-03 13:26:01.022687	2025-09-03 13:26:01.022687	Frontend	https://res.cloudinary.com/duw0bz1md/image/upload/v1754416403/vb0udnaow48xjg63l37v.jpg	["Hands-on projects to apply React concepts immediately", "Covers both functional and class components", "Deep dive into hooks and state management", "Guidance on performance optimization and best practices", "Build a real-world project from scratch"]
\.


--
-- Data for Name: enrollments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.enrollments (id, user_id, course_id, current_module_id, completed, enrolled_at, overall_progress) FROM stdin;
60e1f2e9-f660-48cf-818c-165c47ce4482	user_32C8hRSmiL9y3iS9RBjPb6IwyK1	2e83570e-1ead-44d9-927f-932d1c84e4af	\N	f	2025-09-03 15:29:56.870067	0
97d4b1a8-fefe-460d-9d3e-c19725519fec	user_33FSRgltlGIagMSJmdiwqBjoNjG	375b53dd-f12e-4402-957f-e6400136f6e5	\N	f	2025-09-26 18:30:23.157456	0
e98d6fec-9778-4da2-93d1-24ec6e7a88fd	user_33HmyvIfAC7bIpbnjFob08mQ3tj	2e83570e-1ead-44d9-927f-932d1c84e4af	\N	f	2025-09-27 14:17:58.009033	0
81a66c9f-d66c-498f-812d-8be604258074	user_32C8hRSmiL9y3iS9RBjPb6IwyK1	375b53dd-f12e-4402-957f-e6400136f6e5	\N	f	2025-10-14 07:59:19.336678	0
5e56bc55-5e2e-4c6f-bd9f-e136435d7194	user_34NBi2LVYJxfbekJqWh4DevAeif	2e83570e-1ead-44d9-927f-932d1c84e4af	\N	f	2025-10-21 10:59:42.843963	0
\.


--
-- Data for Name: folders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.folders (id, user_id, title, created_at) FROM stdin;
3d1ae946-26c2-4aef-8189-ddc0a36636b1	user_32C8hRSmiL9y3iS9RBjPb6IwyK1	folder	2025-09-03 20:21:15.638552
\.


--
-- Data for Name: lesson_progress; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.lesson_progress (id, enrollment_id, module_id, lesson_id, completed, started_at, completed_at) FROM stdin;
060f0699-376c-44c3-975d-90a667f3a66a	60e1f2e9-f660-48cf-818c-165c47ce4482	a0de0155-fa50-4aed-a6da-fc407ed98ea3	a79c75ca-2c68-4de1-b377-0cf663b72d04	t	2025-09-03 15:30:08.218087	2025-09-04 14:50:06.85909
325cb406-22d0-4b9a-a319-cd303188ea37	60e1f2e9-f660-48cf-818c-165c47ce4482	a0de0155-fa50-4aed-a6da-fc407ed98ea3	4471c16a-6b18-4e55-9948-9d9f3a1d9545	t	2025-09-03 15:30:20.021146	2025-09-11 13:23:14.632677
48c47411-f1c9-46d3-84f7-8b0c9cb59c65	60e1f2e9-f660-48cf-818c-165c47ce4482	a0de0155-fa50-4aed-a6da-fc407ed98ea3	cd2438d9-7791-49e9-9a38-3e77fcf85cda	t	2025-09-03 15:30:15.163186	2025-09-11 13:25:15.137604
5b9bea87-a50e-4f9b-8692-e06369842480	60e1f2e9-f660-48cf-818c-165c47ce4482	9dcba5c6-c94f-4496-aa9c-736bb1a04860	1b422b82-ed36-478c-a033-b368979b6863	t	2025-09-11 13:30:02.672506	2025-09-11 13:30:39.245535
29baf832-adbe-434b-bf4f-58d8bc5d44fd	60e1f2e9-f660-48cf-818c-165c47ce4482	9dcba5c6-c94f-4496-aa9c-736bb1a04860	134facd9-a9d4-49ae-a039-c126f31b3823	t	2025-09-12 16:14:41.343676	2025-09-12 16:14:48.458971
d36fb039-46e9-4eb3-a6e7-49c34b500347	e98d6fec-9778-4da2-93d1-24ec6e7a88fd	179178cc-0b99-4b4f-93dc-2326f2942d45	4c1c7cb6-7e84-4090-9ccc-9c228980e7ef	f	2025-09-27 14:18:04.802934	\N
6249cbcf-4c21-4911-8665-545b7c0ecb9f	5e56bc55-5e2e-4c6f-bd9f-e136435d7194	179178cc-0b99-4b4f-93dc-2326f2942d45	4c1c7cb6-7e84-4090-9ccc-9c228980e7ef	t	2025-10-21 10:59:55.130861	2025-10-21 11:00:44.710048
5e0f18dd-d28f-4c74-b2c3-9d965dff1b73	5e56bc55-5e2e-4c6f-bd9f-e136435d7194	179178cc-0b99-4b4f-93dc-2326f2942d45	918acfdd-9aaa-46e1-b674-970444442c83	f	2025-10-21 11:01:06.485783	\N
\.


--
-- Data for Name: lessons; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.lessons (id, title, slug, description, content, duration_minutes, level, order_index, topic_id, created_at, updated_at, is_deleted) FROM stdin;
1b422b82-ed36-478c-a033-b368979b6863	Using useState Effectively	react-usestate-hook	Learn the useState hook in depth: what state means in React, how to initialize it, update patterns, pitfalls with async updates, and how to structure local state effectively.	{"sections": [{"text": "In React, **state** allows components to keep track of information that changes over time: form input values, UI toggles, fetched data, etc. Without state, components would be static and unable to respond to user interactions.", "heading": "Why do we need state?"}, {"code": "import React, { useState } from 'react';\\n\\nfunction Counter() {\\n  const [count, setCount] = useState(0);\\n\\n  return (\\n    <div>\\n      <p>You clicked {count} times</p>\\n      <button onClick={() => setCount(count + 1)}>Click me</button>\\n    </div>\\n  );\\n}", "heading": "Declaring state with useState"}, {"text": "Calling `setCount` doesn’t immediately update `count`. React batches updates for performance. If you need the updated value based on the previous state, use the callback form.", "heading": "State updates are asynchronous"}, {"code": "setCount(prevCount => prevCount + 1);", "heading": "Functional update form"}, {"text": "- Keep state as minimal as possible.\\\\n- Derive data when you can instead of storing duplicates.\\\\n- Split state across multiple `useState` calls if unrelated.\\\\n- Lift state up when multiple components need access.", "heading": "Best practices"}, {"text": "This lesson covered the key concepts in detail. Review the examples and apply them in your projects to fully understand the material.", "heading": "Summary"}]}	50	intermediate	1	9dcba5c6-c94f-4496-aa9c-736bb1a04860	2025-09-03 13:50:33.925014	2025-09-03 13:50:33.925014	f
134facd9-a9d4-49ae-a039-c126f31b3823	Managing Side Effects with useEffect	react-useeffect-hook	Master the useEffect hook: how to handle side effects such as data fetching, subscriptions, event listeners, cleanup functions, dependency arrays, and common performance pitfalls.	{"sections": [{"text": "React rendering should remain pure — given the same props and state, a component should return the same JSX. But real-world apps need effects: fetching data, setting timers, subscribing to services, logging. `useEffect` allows you to run such code after render.", "heading": "What are side effects?"}, {"code": "import React, { useState, useEffect } from 'react';\\n\\nfunction Example() {\\n  const [count, setCount] = useState(0);\\n\\n  useEffect(() => {\\n    document.title = `You clicked ${count} times`;\\n  });\\n\\n  return <button onClick={() => setCount(count + 1)}>Click me</button>;\\n}", "heading": "Basic useEffect example"}, {"text": "By default, effects run after every render. To control when they run, pass a second argument: the dependencies array.\\\\n- Empty `[]`: run only once (on mount).\\\\n- `[count]`: run only when `count` changes.", "heading": "Dependencies array"}, {"code": "useEffect(() => {\\n  const id = setInterval(() => console.log('tick'), 1000);\\n  return () => clearInterval(id);\\n}, []);", "heading": "Cleanup functions"}, {"text": "- Always include all dependencies in the array.\\\\n- Avoid unnecessary re-renders by memoizing functions/objects.\\\\n- Prefer splitting effects if they do different things.\\\\n- Understand that useEffect runs after paint, so DOM is already updated.", "heading": "Pitfalls and best practices"}, {"text": "This lesson covered the key concepts in detail. Review the examples and apply them in your projects to fully understand the material.", "heading": "Summary"}]}	60	intermediate	0	9dcba5c6-c94f-4496-aa9c-736bb1a04860	2025-09-03 13:50:33.925014	2025-09-03 13:50:33.925014	f
4c1c7cb6-7e84-4090-9ccc-9c228980e7ef	Project Setup & Architecture	react-project-setup	Learn how to set up a professional React project with Vite, project structure, environment variables, ESLint/Prettier setup, and reusable folder organization patterns.	{"sections": [{"text": "A strong project setup saves time in the long run. It enforces consistency, avoids hidden bugs, and ensures scalability as the project grows. Professional teams rely on linters, formatters, and environment configs from the start.", "heading": "Why setup matters"}, {"code": "npm create vite@latest my-app --template react\\ncd my-app\\nnpm install", "heading": "Scaffolding with Vite"}, {"text": "One common convention is:\\n```\\nsrc/\\n  components/\\n  pages/\\n  hooks/\\n  context/\\n  styles/\\n  utils/\\n```\\nEach folder groups logic by feature or purpose. Keeping related files close makes them easier to maintain.", "heading": "Folder structure"}, {"code": "npm install -D eslint prettier eslint-plugin-react eslint-config-prettier eslint-plugin-prettier\\nnpx eslint --init", "heading": "Configuring ESLint and Prettier"}, {"text": "Create a `.env` file for API keys and sensitive values. In Vite, all variables must be prefixed with `VITE_` to be exposed to the client:\\n```\\nVITE_API_URL=https://api.example.com\\n```", "heading": "Environment variables"}, {"text": "This lesson covered the key concepts in detail. Review the examples and apply them in your projects to fully understand the material.", "heading": "Summary"}]}	60	intermediate	1	179178cc-0b99-4b4f-93dc-2326f2942d45	2025-09-03 14:02:23.505768	2025-09-03 14:02:23.505768	f
a79c75ca-2c68-4de1-b377-0cf663b72d04	Introduction to React & JSX	react-intro-jsx	A deep, conceptual introduction to React: why it exists, the virtual DOM, JSX mechanics, rendering model, and how to reason about UI updates.	{"sections": [{"text": "Before React, building complex, interactive UIs meant manually mutating the DOM and juggling lots of imperative logic. React introduced a declarative component model: you describe the UI for a given application state and let React compute the minimal set of DOM changes. This section explains that motivation, the benefits of a component-based architecture (encapsulation, reusability, separation of concerns), and how declarative rendering reduces bugs and makes reasoning about UI simpler at application scale.", "heading": "Why React? — motivation and high-level design"}, {"text": "The virtual DOM is a lightweight in-memory representation of the real DOM. React maintains this structure and, when state changes, re-renders the virtual DOM and performs a diff against the previous virtual DOM to compute a patch. By batching updates and minimizing direct DOM writes, React achieves better performance and predictable updates. We'll cover reconciliation basics, keys for list rendering, and common anti-patterns that can force expensive reflows.", "heading": "The Virtual DOM — what it is and why it matters"}, {"text": "JSX is a syntactic sugar that looks like HTML inside JavaScript. It compiles to `React.createElement(...)` calls and allows embedding expressions with `{}`. JSX improves readability by colocating markup and logic, but it is just JavaScript: remember that attributes use camelCase (`className`, `htmlFor`) and that JSX expressions must evaluate to something renderable.", "heading": "JSX: syntax, pros, and pitfalls"}, {"code": "import React from 'react';\\nimport { createRoot } from 'react-dom/client';\\n\\nconst element = <h1 className=\\"greeting\\">Hello, React!</h1>;\\n\\nconst root = createRoot(document.getElementById('root'));\\nroot.render(element);", "heading": "JSX Example — basic rendering"}, {"code": "const user = { name: 'Alice' };\\nconst element = <h1>Hello, {user.name}</h1>;\\n\\nconst numbers = [1,2,3];\\nconst list = numbers.map(n => <li key={n}>Item {n}</li>);\\nconst ul = <ul>{list}</ul>;", "heading": "Embedding expressions and lists"}, {"text": "This lesson covered the key concepts in detail. Review the examples and apply them in your projects to fully understand the material.", "heading": "Summary"}]}	40	beginner	1	a0de0155-fa50-4aed-a6da-fc407ed98ea3	2025-09-03 13:43:52.367009	2025-09-03 13:43:52.367009	f
292ccc37-ffed-4719-8eba-e2e46647244d	Introduction to Databases & MongoDB Setup	intro-databases-mongodb	Learn what databases are, differences between SQL and NoSQL, and set up MongoDB for Node.js.	{"sections": [{"text": "A database is an organized collection of data. Applications use databases to persist information beyond runtime. Two main types are: SQL (structured, relational) and NoSQL (document-based, flexible).", "heading": "What is a database?"}, {"text": "- **SQL**: Structured, uses schemas (Postgres, MySQL).\\n- **NoSQL**: Schema-less, flexible, stores JSON-like documents (MongoDB, CouchDB).", "heading": "SQL vs NoSQL"}, {"text": "You can install MongoDB Community Edition from mongodb.com or use Atlas for a free cloud cluster. Run `mongod` to start the server.", "heading": "Installing MongoDB locally"}, {"code": "npm install mongoose\\n\\nconst mongoose = require('mongoose');\\n\\nmongoose.connect('mongodb://localhost:27017/mydb')\\n  .then(() => console.log('MongoDB connected'))\\n  .catch(err => console.error(err));", "heading": "Connecting Node.js with MongoDB"}, {"text": "This lesson covered the key concepts in detail. Review the examples and apply them in your projects to fully understand the material.", "heading": "Summary"}]}	65	beginner	1	\N	2025-09-03 14:21:04.928177	2025-09-03 14:21:04.928177	f
cd2438d9-7791-49e9-9a38-3e77fcf85cda	Creating Your First Component	react-first-component	How to build small, composable React components: function components, composition, naming rules, returned JSX shape, and pragmatic folder/prop patterns for maintainable apps.	{"sections": [{"text": "A component is a reusable, encapsulated piece of UI that can hold markup, styles (via CSS modules, styled-components, or plain CSS), and behavior. Components should be small, focused, and composable. This section discusses the tradeoffs in granularity (too large vs too small), how to think in components, and how single-responsibility improves testability and readability.", "heading": "What is a component? — unit of UI with behavior"}, {"code": "import React from 'react';\\n\\nfunction Welcome() {\\n  return (\\n    <header>\\n      <h1>Welcome to React!</h1>\\n      <p>This component renders a greeting.</p>\\n    </header>\\n  );\\n}\\n\\nexport default Welcome;", "heading": "Function component example and explanation"}, {"code": "import React from 'react';\\nimport Welcome from './Welcome';\\nimport Nav from './Nav';\\n\\nexport default function App() {\\n  return (\\n    <div>\\n      <Nav />\\n      <main>\\n        <Welcome />\\n        <p>App content goes here.</p>\\n      </main>\\n    </div>\\n  );\\n}", "heading": "Composing components in App"}, {"text": "Component names must start with a capital letter so React can distinguish them from DOM tags. A component should return a single root (use fragments `<>...</>` when you do not want an extra wrapper), and prefer descriptive names (`UserCard`, `LoginForm`). Discusses recommended folder structure (feature-based folders, `index.js` re-exports) and the advantages of co-locating tests and styles with the component.", "heading": "Naming rules and structure"}, {"text": "Avoid deeply nested prop drilling; prefer composition and lifting state up only when necessary. Keep components pure where possible (no side-effects in render), and move imperative logic into hooks or utility functions. Explain when to extract a component vs keep inline.", "heading": "Practical tips and anti-patterns"}, {"text": "This lesson covered the key concepts in detail. Review the examples and apply them in your projects to fully understand the material.", "heading": "Summary"}]}	55	beginner	0	a0de0155-fa50-4aed-a6da-fc407ed98ea3	2025-09-03 13:43:52.367009	2025-09-03 13:43:52.367009	f
918acfdd-9aaa-46e1-b674-970444442c83	Building Components & Styling	react-project-components-styling	Build reusable React components, style them with CSS/Tailwind, and understand component-driven development.	{"sections": [{"text": "Instead of thinking about pages first, think about **components**: buttons, cards, navbars, inputs. Pages are simply compositions of these reusable building blocks.", "heading": "Component-driven development"}, {"code": "export default function Button({ children, onClick }) {\\n  return (\\n    <button\\n      onClick={onClick}\\n      className=\\"px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600\\"\\n    >\\n      {children}\\n    </button>\\n  );\\n}", "heading": "Example: Button component"}, {"text": "- **CSS Modules**: Scoped CSS per component.\\n- **Tailwind CSS**: Utility-first styling.\\n- **Styled-components**: CSS-in-JS approach.\\n- Pick one approach and stick to it for consistency.", "heading": "Styling approaches"}, {"text": "Instead of creating multiple `ButtonPrimary`, `ButtonSecondary`, etc., use **props** to handle variants. This avoids repeating similar components.", "heading": "Composition over duplication"}, {"text": "- Keep components small and focused.\\n- Reuse components across pages.\\n- Name files consistently (`PascalCase`).\\n- Organize by feature, not just by type.", "heading": "Best practices"}, {"text": "This lesson covered the key concepts in detail. Review the examples and apply them in your projects to fully understand the material.", "heading": "Summary"}]}	70	intermediate	2	179178cc-0b99-4b4f-93dc-2326f2942d45	2025-09-03 14:02:23.505768	2025-09-03 14:02:23.505768	f
11c77bae-ce7d-410d-9de9-3de334e10300	CRUD with MongoDB & Mongoose	mongodb-crud-mongoose	Learn how to model schemas with Mongoose and perform CRUD operations in MongoDB from an Express app.	{"sections": [{"code": "const { Schema, model } = require('mongoose');\\n\\nconst UserSchema = new Schema({\\n  name: String,\\n  email: { type: String, unique: true },\\n  createdAt: { type: Date, default: Date.now }\\n});\\n\\nconst User = model('User', UserSchema);", "heading": "Defining a schema"}, {"code": "// Create\\napp.post('/users', async (req, res) => {\\n  const user = await User.create(req.body);\\n  res.status(201).json(user);\\n});\\n\\n// Read all\\napp.get('/users', async (req, res) => {\\n  const users = await User.find();\\n  res.json(users);\\n});", "heading": "Create & Read"}, {"code": "// Update\\napp.put('/users/:id', async (req, res) => {\\n  const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });\\n  res.json(updated);\\n});\\n\\n// Delete\\napp.delete('/users/:id', async (req, res) => {\\n  await User.findByIdAndDelete(req.params.id);\\n  res.status(204).send();\\n});", "heading": "Update & Delete"}, {"text": "Mongoose provides schema validation, middleware hooks, and easy-to-use query helpers for MongoDB, making it safer and easier to manage data.", "heading": "Why use Mongoose?"}, {"text": "This lesson covered the key concepts in detail. Review the examples and apply them in your projects to fully understand the material.", "heading": "Summary"}]}	85	intermediate	2	\N	2025-09-03 14:21:17.348314	2025-09-03 14:21:17.348314	f
e37aa1be-91c0-4e08-b59d-6a36f319ec37	Connecting Express with PostgreSQL	express-postgresql	Learn how to connect Express.js with PostgreSQL using node-postgres (pg) and build SQL-powered APIs.	{"sections": [{"code": "npm install pg", "heading": "Installing node-postgres"}, {"code": "const { Pool } = require('pg');\\n\\nconst pool = new Pool({\\n  user: 'postgres',\\n  host: 'localhost',\\n  database: 'mydb',\\n  password: 'password',\\n  port: 5432,\\n});\\n\\npool.connect()\\n  .then(() => console.log('Connected to Postgres'))\\n  .catch(err => console.error(err));", "heading": "Connecting to PostgreSQL"}, {"code": "// Create\\napp.post('/products', async (req, res) => {\\n  const { name, price } = req.body;\\n  const result = await pool.query('INSERT INTO products (name, price) VALUES ($1, $2) RETURNING *', [name, price]);\\n  res.json(result.rows[0]);\\n});\\n\\n// Read\\napp.get('/products', async (req, res) => {\\n  const result = await pool.query('SELECT * FROM products');\\n  res.json(result.rows);\\n});", "heading": "CRUD with SQL"}, {"text": "- Use **Postgres** when your data has strong relationships (users, orders).\\n- Use **MongoDB** when your data is document-like, flexible, or schema-less.\\n- Many real apps combine both!", "heading": "Choosing SQL vs NoSQL"}, {"text": "This lesson covered the key concepts in detail. Review the examples and apply them in your projects to fully understand the material.", "heading": "Summary"}]}	90	advanced	3	\N	2025-09-03 14:21:29.808797	2025-09-03 14:21:29.808797	f
b77656fb-eb89-4b7a-9d37-a13057452fc4	Code Splitting & Dynamic Imports	code-splitting-dynamic-imports	Learn how to reduce initial bundle size with code splitting, lazy loading, and dynamic imports.	{"sections": [{"text": "Instead of shipping the entire JS bundle at once, split it into smaller chunks so the browser only loads what is needed.", "heading": "Why code splitting?"}, {"code": "button.addEventListener('click', async () => {\\\\n  const module = await import('./analytics.js');\\\\n  module.trackEvent('button_clicked');\\\\n});", "heading": "Dynamic imports in ESModules"}, {"code": "output: {\\\\n  filename: '[name].[contenthash].js',\\\\n  chunkFilename: '[name].[id].[contenthash].js'\\\\n}", "heading": "Webpack example"}, {"code": "const Chart = React.lazy(() => import('./Chart'));\\\\n\\\\n<Suspense fallback={<div>Loading...</div>}>\\\\n  <Chart />\\\\n</Suspense>", "heading": "React lazy loading"}, {"text": "Code splitting reduces Time-to-Interactive (TTI) and improves Lighthouse scores.", "heading": "Impact"}, {"text": "This lesson covered the key concepts in detail. Review the examples and apply them in your projects to fully understand the material.", "heading": "Summary"}]}	85	intermediate	1	\N	2025-09-03 14:25:08.547609	2025-09-03 14:25:08.547609	f
4471c16a-6b18-4e55-9948-9d9f3a1d9545	Props and Component Reusability	react-props-reusability	In-depth coverage of props: passing data, destructuring, default values, immutability, common patterns (render props, children), and how props interact with state to build predictable UIs.	{"sections": [{"text": "Props are the mechanism to pass data from parent to child components. They are immutable from the child’s perspective: a child must not modify props. This single-direction (top-down) data flow is a cornerstone for predictable component behavior. This section discusses how to reason about data ownership and when to lift state up.", "heading": "Understanding props — single-direction data flow"}, {"code": "function Welcome(props) {\\n  return <h1>Hello, {props.name}!</h1>;\\n}\\n\\nexport default function App() {\\n  return (\\n    <div>\\n      <Welcome name=\\"Alice\\" />\\n      <Welcome name=\\"Bob\\" />\\n    </div>\\n  );\\n}", "heading": "Passing props — concrete examples"}, {"code": "function Greeting({ name = 'Guest', title }) {\\n  return <p>{title} {name}</p>;\\n}\\n\\n// Usage: <Greeting title=\\"Dr.\\" /> -> renders: Dr. Guest\\n", "heading": "Destructuring and defaults"}, {"text": "For runtime validation in JS projects, `prop-types` can help catch wrong shapes during development. In TypeScript projects, prefer typing props with interfaces for compile-time safety. Example of using `prop-types` and a brief TS interface example are included.", "heading": "PropTypes, TypeScript, and typing props"}, {"text": "Props are external inputs and should be treated as read-only. State is internal and can change. Immutability is important: when updating arrays or objects in state, always produce new references (e.g., via spread) to allow React to detect changes. This section explains common bugs arising from mutating objects and shows safe update patterns.", "heading": "Props vs State and immutability"}, {"text": "This lesson covered the key concepts in detail. Review the examples and apply them in your projects to fully understand the material.", "heading": "Summary"}]}	45	beginner	2	a0de0155-fa50-4aed-a6da-fc407ed98ea3	2025-09-03 13:43:52.367009	2025-09-03 13:43:52.367009	f
b6a774d0-6958-4b8c-a1ea-1bea7c5713c7	Data Fetching & State Integration	react-project-data-fetching	Learn how to fetch data from APIs, manage loading/error states, integrate local and remote state, and structure data flow in a React project.	{"sections": [{"code": "import { useEffect, useState } from 'react';\\n\\nfunction Users() {\\n  const [users, setUsers] = useState([]);\\n  const [loading, setLoading] = useState(true);\\n  const [error, setError] = useState(null);\\n\\n  useEffect(() => {\\n    fetch('https://jsonplaceholder.typicode.com/users')\\n      .then(res => res.json())\\n      .then(data => {\\n        setUsers(data);\\n        setLoading(false);\\n      })\\n      .catch(err => {\\n        setError(err.message);\\n        setLoading(false);\\n      });\\n  }, []);\\n\\n  if (loading) return <p>Loading...</p>;\\n  if (error) return <p>Error: {error}</p>;\\n\\n  return (\\n    <ul>\\n      {users.map(u => <li key={u.id}>{u.name}</li>)}\\n    </ul>\\n  );\\n}", "heading": "Fetching data with fetch"}, {"text": "Always account for async state: **loading**, **success**, and **error**. A good UI communicates clearly to users instead of failing silently.", "heading": "Handling loading and error states"}, {"text": "Remote state (from APIs) often combines with local UI state (e.g., modals, input values). Keep them separate but coordinated. Example: fetch user list remotely but manage modal visibility locally.", "heading": "Integrating local and remote state"}, {"text": "While `fetch` works, libraries like **React Query (TanStack Query)** or **SWR** handle caching, retries, and background revalidation. They make apps more resilient and performant.", "heading": "Data fetching libraries"}, {"text": "- Abstract fetch logic into custom hooks (`useUsers`).\\n- Normalize data shape for consistency.\\n- Always handle slow network conditions gracefully.\\n- Use proper error boundaries for UI resilience.", "heading": "Best practices"}, {"text": "This lesson covered the key concepts in detail. Review the examples and apply them in your projects to fully understand the material.", "heading": "Summary"}]}	80	intermediate	3	179178cc-0b99-4b4f-93dc-2326f2942d45	2025-09-03 14:02:23.505768	2025-09-03 14:02:23.505768	f
2ee858d5-e29c-471d-948a-c4a3033a6f4f	What is Node.js & Why Use It?	nodejs-introduction	Understand what Node.js is, how it works under the hood (V8, event loop), and why it is popular for backend development.	{"sections": [{"text": "Node.js is a runtime environment that lets you run **JavaScript outside the browser**. It’s built on Google’s **V8 engine** and provides an event-driven, non-blocking I/O model that makes it lightweight and efficient.", "heading": "Node.js in a nutshell"}, {"code": "const fs = require('fs');\\n\\nconsole.log('Start reading file');\\nfs.readFile('example.txt', 'utf8', (err, data) => {\\n  if (err) throw err;\\n  console.log(data);\\n});\\nconsole.log('End of script');", "heading": "Event-driven architecture"}, {"text": "- Same language (JS) for frontend & backend.\\\\n- Huge ecosystem (npm).\\\\n- Scales well for I/O-heavy apps.\\\\n- Perfect for APIs, microservices, and real-time apps (chat, sockets).", "heading": "Why use Node.js?"}, {"text": "Not ideal for CPU-heavy tasks like image processing, video encoding, or large ML workloads. In those cases, offload heavy tasks to worker services.", "heading": "When not to use Node.js?"}, {"text": "This lesson covered the key concepts in detail. Review the examples and apply them in your projects to fully understand the material.", "heading": "Summary"}]}	45	beginner	1	\N	2025-09-03 14:12:21.186664	2025-09-03 14:12:21.186664	f
1de1e0d1-ef21-4433-95b7-c7b7d4e9cbb8	Advanced State Management Patterns	react-advanced-state	Explore advanced state management: complex state with objects/arrays, custom hooks, lifting state up, prop drilling issues, and an introduction to Context for global state.	{"sections": [{"text": "Sometimes you need to manage collections or nested state. Always create new objects/arrays when updating to maintain immutability and allow React to detect changes.", "heading": "Complex state objects and arrays"}, {"code": "const [user, setUser] = useState({ name: 'Alice', address: { city: 'NY' } });\\n\\nsetUser(prev => ({\\n  ...prev,\\n  address: { ...prev.address, city: 'LA' }\\n}));", "heading": "Updating nested state safely"}, {"text": "Custom hooks let you extract reusable logic. For example, managing form inputs, fetching data, or handling intervals. They’re just functions that use other hooks and must start with `use`.", "heading": "Custom hooks"}, {"code": "function useWindowWidth() {\\n  const [width, setWidth] = useState(window.innerWidth);\\n  useEffect(() => {\\n    const handleResize = () => setWidth(window.innerWidth);\\n    window.addEventListener('resize', handleResize);\\n    return () => window.removeEventListener('resize', handleResize);\\n  }, []);\\n  return width;\\n}", "heading": "Example: useWindowWidth"}, {"text": "As apps grow, passing props through many layers (prop drilling) becomes painful. React’s Context API provides a way to pass values deeply without manual propagation. It’s not a replacement for every case but helps with theming, authentication, and user settings.", "heading": "From prop drilling to Context"}, {"text": "This lesson covered the key concepts in detail. Review the examples and apply them in your projects to fully understand the material.", "heading": "Summary"}]}	70	intermediate	2	9dcba5c6-c94f-4496-aa9c-736bb1a04860	2025-09-03 13:50:33.925014	2025-09-03 13:50:33.925014	f
5fe34c50-66ac-451d-8b9b-28bf2b50156e	Installing Node.js & Project Setup	nodejs-setup	Learn how to install Node.js, set up npm, initialize a project, and understand package.json.	{"sections": [{"text": "Download from [nodejs.org](https://nodejs.org). Prefer the LTS version for production. Verify installation with:\\n```\\nnode -v\\nnpm -v\\n```", "heading": "Installing Node.js"}, {"code": "mkdir my-app && cd my-app\\nnpm init -y", "heading": "Initializing a project"}, {"text": "This file stores metadata about the project, dependencies, and scripts. Example:\\n```\\n{\\n  \\"name\\": \\"my-app\\",\\n  \\"scripts\\": { \\"start\\": \\"node index.js\\" }\\n}\\n```", "heading": "Understanding package.json"}, {"code": "npm install express cors dotenv", "heading": "Installing dependencies"}, {"text": "- `dependencies`: required in production (express).\\\\n- `devDependencies`: only needed in dev (nodemon, eslint).", "heading": "Dev dependencies vs dependencies"}, {"text": "This lesson covered the key concepts in detail. Review the examples and apply them in your projects to fully understand the material.", "heading": "Summary"}]}	50	beginner	2	\N	2025-09-03 14:12:21.186664	2025-09-03 14:12:21.186664	f
a9a0488c-4bf5-4ce7-bbae-e8ba56332553	Getting Started with Express.js	express-getting-started	Learn what Express.js is, why it simplifies Node.js development, and create your first Express server with routes.	{"sections": [{"text": "Express.js is a minimal and flexible Node.js framework for building web applications and APIs. It provides routing, middleware, and request/response utilities so you don’t have to work with raw Node.js HTTP module.", "heading": "Why Express?"}, {"code": "npm install express", "heading": "Installing Express"}, {"code": "const express = require('express');\\nconst app = express();\\n\\napp.get('/', (req, res) => {\\n  res.send('Hello from Express!');\\n});\\n\\napp.listen(3000, () => console.log('Server running on http://localhost:3000'));", "heading": "Hello World with Express"}, {"text": "Express routes define how your server responds to requests. Example: app.get('/users', callback). Other methods include POST, PUT, DELETE.", "heading": "Routing basics"}, {"text": "This lesson covered the key concepts in detail. Review the examples and apply them in your projects to fully understand the material.", "heading": "Summary"}]}	60	beginner	1	\N	2025-09-03 14:19:26.69912	2025-09-03 14:19:26.69912	f
8a91be5a-3ad9-4229-87e5-e0ba02e7aebd	Understanding Middleware	express-middleware	Understand how middleware functions work in Express, including request logging, parsing JSON, and custom middleware.	{"sections": [{"text": "Middleware are functions that run during the request-response cycle. They can modify req and res, execute code, or end the request.", "heading": "What is middleware?"}, {"code": "app.use(express.json());\\napp.use(express.urlencoded({ extended: true }));", "heading": "Built-in middleware"}, {"code": "function logger(req, res, next) {\\n  console.log(`${req.method} ${req.url}`);\\n  next();\\n}\\n\\napp.use(logger);", "heading": "Custom middleware example"}, {"text": "Middleware with four parameters (err, req, res, next) handle errors. Example:\\n```js\\napp.use((err, req, res, next) => {\\n  res.status(500).send('Something broke!');\\n});\\n```", "heading": "Error-handling middleware"}, {"text": "This lesson covered the key concepts in detail. Review the examples and apply them in your projects to fully understand the material.", "heading": "Summary"}]}	70	intermediate	2	\N	2025-09-03 14:20:09.91174	2025-09-03 14:20:09.91174	f
289c1bba-2269-47f6-83ab-4a9286d1a216	Caching & CDNs	caching-and-cdns	Learn how caching strategies and CDNs reduce server load, speed up delivery, and improve global performance.	{"sections": [{"text": "Caching stores resources closer to the user (browser cache, CDN edge nodes). This reduces repeated network requests.", "heading": "What is caching?"}, {"code": "Cache-Control: public, max-age=31536000, immutable", "heading": "Cache-Control headers"}, {"text": "A CDN distributes static assets across global servers. Users download files from the nearest node, improving speed.", "heading": "Using a CDN"}, {"text": "- Browser caching (images, CSS, JS)\\n- CDN caching\\n- Service Worker caching (for PWAs)", "heading": "Types of caching"}, {"text": "- Version files using hashes (style.abc123.css).\\n- Set long max-age for static files.\\n- Use `stale-while-revalidate` for smoother updates.", "heading": "Best practices"}, {"text": "This lesson covered the key concepts in detail. Review the examples and apply them in your projects to fully understand the material.", "heading": "Summary"}]}	80	intermediate	3	\N	2025-09-03 14:24:24.921503	2025-09-03 14:24:24.921503	f
8b84eaa3-f37d-43bf-81f7-4dd15878963c	Building RESTful APIs	express-restful-apis	Learn how to design and implement RESTful APIs with Express.js: CRUD operations, request params, and JSON responses.	{"sections": [{"text": "REST (Representational State Transfer) is an architectural style for designing APIs around resources (users, posts, products). Each resource is accessed via standard HTTP methods (GET, POST, PUT, DELETE).", "heading": "What is REST?"}, {"code": "const express = require('express');\\nconst app = express();\\napp.use(express.json());\\n\\nlet users = [{ id: 1, name: 'Alice' }];\\n\\n// Read\\napp.get('/users', (req, res) => res.json(users));\\n\\n// Create\\napp.post('/users', (req, res) => {\\n  const user = { id: users.length + 1, ...req.body };\\n  users.push(user);\\n  res.status(201).json(user);\\n});\\n\\n// Update\\napp.put('/users/:id', (req, res) => {\\n  const id = parseInt(req.params.id);\\n  const user = users.find(u => u.id === id);\\n  if (!user) return res.status(404).send();\\n  user.name = req.body.name;\\n  res.json(user);\\n});\\n\\n// Delete\\napp.delete('/users/:id', (req, res) => {\\n  users = users.filter(u => u.id !== parseInt(req.params.id));\\n  res.status(204).send();\\n});", "heading": "CRUD example with Express"}, {"text": "Use res.json() to return structured JSON data. Example: res.json({ message: 'Success' }).", "heading": "Sending JSON responses"}, {"text": "- Use proper status codes (200, 201, 404, 500).\\n- Separate routes/controllers for cleaner code.\\n- Validate request body with libraries like Joi or Zod.", "heading": "Best practices"}, {"text": "This lesson covered the key concepts in detail. Review the examples and apply them in your projects to fully understand the material.", "heading": "Summary"}]}	80	intermediate	3	\N	2025-09-03 14:20:09.91174	2025-09-03 14:20:09.91174	f
796a79b9-6bc4-4e1e-8321-bbecd69d1e3e	Introduction to Web Performance	intro-web-performance	Understand why web performance matters, how it impacts user experience, and how browsers render web pages.	{"sections": [{"text": "A faster website improves user satisfaction, retention, and SEO rankings. Research shows that a 1-second delay in load time can reduce conversions by 7%.", "heading": "Why does performance matter?"}, {"text": "Browsers follow a pipeline: HTML → DOM, CSS → CSSOM, then combine into the Render Tree, Layout, and Paint. Large CSS or JavaScript can delay this pipeline.", "heading": "Critical Rendering Path"}, {"text": "- First Contentful Paint (FCP): when something first appears on screen.\\n- Largest Contentful Paint (LCP): when the main content is rendered.\\n- Cumulative Layout Shift (CLS): visual stability.\\n- Time to Interactive (TTI): when the page is fully usable.", "heading": "Key performance metrics"}, {"code": "<!DOCTYPE html>\\n<html>\\n  <head>\\n    <title>Slow Page</title>\\n    <script>for(let i=0;i<1e8;i++){};</script>\\n  </head>\\n  <body>\\n    <h1>Hello World</h1>\\n  </body>\\n</html>", "heading": "Quick experiment"}, {"text": "This lesson covered the key concepts in detail. Review the examples and apply them in your projects to fully understand the material.", "heading": "Summary"}]}	60	beginner	1	\N	2025-09-03 14:23:03.055889	2025-09-03 14:23:03.055889	f
bead8384-d48b-4fd6-a18b-c1a3305c1296	Measuring Performance with Chrome DevTools	measuring-performance-devtools	Learn how to measure frontend performance using Chrome DevTools and Lighthouse to identify bottlenecks.	{"sections": [{"text": "The Performance tab in Chrome records page load events, scripting time, and layout shifts. It helps identify what blocks rendering.", "heading": "Using the Performance tab"}, {"text": "Lighthouse generates performance scores from 0–100. It provides suggestions like compress images, reduce unused CSS, or defer JavaScript.", "heading": "Lighthouse audits"}, {"text": "You can simulate 3G/4G speeds in DevTools to understand how users with slower internet experience your site.", "heading": "Network throttling"}, {"code": "<script>\\nsetTimeout(() => {\\n  document.body.innerHTML += '<p>Loaded late!</p>';\\n}, 3000);\\n</script>", "heading": "Code example: adding a delay"}, {"text": "This lesson covered the key concepts in detail. Review the examples and apply them in your projects to fully understand the material.", "heading": "Summary"}]}	75	beginner	2	\N	2025-09-03 14:23:13.002827	2025-09-03 14:23:13.002827	f
3ed0bc82-51ec-4410-8358-cb6554f07e3a	Identifying Render-Blocking Resources	render-blocking-resources	Learn what render-blocking resources are (CSS, JavaScript) and how to optimize them for faster page loads.	{"sections": [{"text": "CSS files are render-blocking by default. JavaScript loaded synchronously also blocks the parser until executed.", "heading": "What blocks rendering?"}, {"code": "<script src='app.js' defer></script>\\n<script src='analytics.js' async></script>", "heading": "Deferring scripts"}, {"text": "Critical CSS is the minimum CSS required to render above-the-fold content. It can be inlined in <style> to speed up first paint.", "heading": "Inlining critical CSS"}, {"text": "Tools like PurgeCSS or Tailwind's JIT remove unused CSS classes to drastically reduce bundle size.", "heading": "Removing unused CSS"}, {"text": "A Shopify store reduced LCP by 40% just by moving non-critical JS to `defer` and inlining critical CSS.", "heading": "Case study"}, {"text": "This lesson covered the key concepts in detail. Review the examples and apply them in your projects to fully understand the material.", "heading": "Summary"}]}	85	intermediate	3	\N	2025-09-03 14:23:24.091955	2025-09-03 14:23:24.091955	f
1e338e92-5bb3-4c33-9a77-725bc300e846	Optimizing Images for the Web	optimizing-images-web	Learn techniques to reduce image size and improve performance using modern formats, compression, and responsive loading.	{"sections": [{"text": "Images often account for 50–70% of page weight. Optimizing them reduces load times drastically, especially on mobile.", "heading": "Why image optimization?"}, {"text": "- WebP: 25–35% smaller than JPEG/PNG.\\n- AVIF: even better compression, supported by modern browsers.", "heading": "Use modern formats"}, {"code": "<img src='image-480.jpg' srcset='image-480.jpg 480w, image-800.jpg 800w, image-1200.jpg 1200w' sizes='(max-width: 600px) 480px, 800px' alt='Sample'>", "heading": "Responsive images"}, {"code": "<img src='large-photo.jpg' loading='lazy' alt='Lazy loaded image'>", "heading": "Lazy loading"}, {"text": "Use tools like ImageOptim, TinyPNG, or `sharp` in Node.js for automated compression pipelines.", "heading": "Tools for compression"}, {"text": "This lesson covered the key concepts in detail. Review the examples and apply them in your projects to fully understand the material.", "heading": "Summary"}]}	70	beginner	1	\N	2025-09-03 14:24:03.864713	2025-09-03 14:24:03.864713	f
6e6773c0-906d-4197-8baf-c76d9f474f54	Efficient Font Loading	efficient-font-loading	Learn how to optimize web fonts with preloading, subsetting, and fallback strategies for faster rendering.	{"sections": [{"text": "By default, custom fonts block text rendering until loaded (FOIT: Flash of Invisible Text).", "heading": "Fonts as render-blocking resources"}, {"code": "<link rel='preload' href='/fonts/myfont.woff2' as='font' type='font/woff2' crossorigin>", "heading": "Preload critical fonts"}, {"text": "- font-display: swap → fallback text shows immediately, font swaps when loaded.\\n- font-display: optional → fallback text may remain if font loads late.", "heading": "Font-display strategies"}, {"text": "Remove unused glyphs (e.g., limit to Latin only) to reduce font file size drastically.", "heading": "Subsetting fonts"}, {"text": "The Financial Times reduced font load time by 1s by subsetting and preloading critical fonts.", "heading": "Case study"}, {"text": "This lesson covered the key concepts in detail. Review the examples and apply them in your projects to fully understand the material.", "heading": "Summary"}]}	75	intermediate	2	\N	2025-09-03 14:24:14.684115	2025-09-03 14:24:14.684115	f
f64e17e6-858c-463d-ba72-b793b501d291	Web Workers & Offloading Work	web-workers-offloading	Use Web Workers to move heavy computations off the main thread for smoother UI performance.	{"sections": [{"text": "The browser main thread handles rendering + JS execution. Heavy tasks block rendering → janky UI. Workers run in parallel.", "heading": "Why Web Workers?"}, {"code": "// worker.js\\\\nself.onmessage = (e) => {\\\\n  const result = heavyCalculation(e.data);\\\\n  postMessage(result);\\\\n};", "heading": "Creating a worker"}, {"code": "const worker = new Worker('worker.js');\\\\nworker.postMessage(data);\\\\nworker.onmessage = (e) => console.log('Result:', e.data);", "heading": "Using the worker in main thread"}, {"text": "Special type of worker that intercepts network requests → enables offline support, caching, and push notifications.", "heading": "Service Workers"}, {"text": "- Keep worker scripts small.\\\\n- Offload CPU-intensive or async tasks.\\\\n- Avoid excessive worker spawning (memory cost).", "heading": "Best practices"}, {"text": "This lesson covered the key concepts in detail. Review the examples and apply them in your projects to fully understand the material.", "heading": "Summary"}]}	90	advanced	2	\N	2025-09-03 14:25:17.854862	2025-09-03 14:25:17.854862	f
643c7fb8-f060-4c6f-859e-ed519551fe2b	Measuring & Monitoring Performance	measuring-monitoring-performance	Learn how to track performance using Lighthouse, Core Web Vitals, and real-user monitoring (RUM).	{"sections": [{"text": "Set thresholds (JS < 200kb, CSS < 100kb, LCP < 2.5s) to enforce limits on assets and timings.", "heading": "Performance budget"}, {"text": "- LCP: Largest Contentful Paint\\\\n- CLS: Cumulative Layout Shift\\\\n- FID: First Input Delay", "heading": "Core Web Vitals"}, {"code": "npx lighthouse https://example.com --view", "heading": "Measuring with Lighthouse"}, {"code": "import { getCLS, getFID, getLCP } from 'web-vitals';\\\\n\\\\ngetCLS(console.log);\\\\ngetFID(console.log);\\\\ngetLCP(console.log);", "heading": "Web Vitals JS library"}, {"text": "Integrate tools like NewRelic, Datadog, or custom analytics to measure performance in real world, not just in lab conditions.", "heading": "RUM (Real-User Monitoring)"}, {"text": "This lesson covered the key concepts in detail. Review the examples and apply them in your projects to fully understand the material.", "heading": "Summary"}]}	95	advanced	3	\N	2025-09-03 14:25:28.461694	2025-09-03 14:25:28.461694	f
\.


--
-- Data for Name: module_progress; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.module_progress (id, enrollment_id, module_id, started_at, completed_at, progress) FROM stdin;
75752b22-c7a6-45e8-9c0e-1dce6ec7124d	60e1f2e9-f660-48cf-818c-165c47ce4482	a0de0155-fa50-4aed-a6da-fc407ed98ea3	2025-09-03 15:30:07.925484	\N	100
efe008eb-6abf-47e6-b666-c244a1975fc8	60e1f2e9-f660-48cf-818c-165c47ce4482	9dcba5c6-c94f-4496-aa9c-736bb1a04860	2025-09-11 13:30:02.379664	\N	67
a56ff552-27aa-4dae-9115-934bd3bfef68	e98d6fec-9778-4da2-93d1-24ec6e7a88fd	179178cc-0b99-4b4f-93dc-2326f2942d45	2025-09-27 14:18:04.497327	\N	0
c50ca986-69c2-41c6-9716-a161a9eb05ef	5e56bc55-5e2e-4c6f-bd9f-e136435d7194	179178cc-0b99-4b4f-93dc-2326f2942d45	2025-10-21 10:59:54.830788	\N	33
\.


--
-- Data for Name: modules; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.modules (id, title, order_index, course_id, created_at, updated_at, is_deleted) FROM stdin;
0e7ea973-ee3f-447f-aeb8-d67614bde906	mlksjdlfksd	6	2e83570e-1ead-44d9-927f-932d1c84e4af	2025-09-15 12:04:35.870907	2025-09-15 12:04:43.491483	t
179178cc-0b99-4b4f-93dc-2326f2942d45	Building a Real Project	0	2e83570e-1ead-44d9-927f-932d1c84e4af	2025-09-03 13:29:58.524874	2025-09-03 13:29:58.524874	f
9dcba5c6-c94f-4496-aa9c-736bb1a04860	Hooks & State Management	1	2e83570e-1ead-44d9-927f-932d1c84e4af	2025-09-03 13:29:58.524874	2025-09-03 13:29:58.524874	f
a0de0155-fa50-4aed-a6da-fc407ed98ea3	React Basics & Components	2	2e83570e-1ead-44d9-927f-932d1c84e4af	2025-09-03 13:29:58.524874	2025-09-03 13:29:58.524874	f
85761ba7-343c-467d-b3de-023574751a11	Introduction to Node.js	1	375b53dd-f12e-4402-957f-e6400136f6e5	2025-09-03 13:29:58.524874	2025-09-03 13:29:58.524874	f
dff2e9b2-6af4-4ab6-8dc7-566a7d1126fd	Express.js & REST APIs	2	375b53dd-f12e-4402-957f-e6400136f6e5	2025-09-03 13:29:58.524874	2025-09-03 13:29:58.524874	f
eefad49e-5e1b-45da-af78-e06e3fd81709	Authentication & Deployment	3	375b53dd-f12e-4402-957f-e6400136f6e5	2025-09-03 13:29:58.524874	2025-09-03 13:29:58.524874	f
bb969041-77a5-47f3-85eb-8c9c43765860	Foundations of AI & ML	1	e69ca435-deaf-4603-a97b-e6375ba68773	2025-09-03 13:29:58.524874	2025-09-03 13:29:58.524874	f
1804ab71-89e2-42a2-af2d-dc6e5fe65928	Data Preprocessing & Modeling	2	e69ca435-deaf-4603-a97b-e6375ba68773	2025-09-03 13:29:58.524874	2025-09-03 13:29:58.524874	f
b791f6cf-cb74-49b9-87c6-3b01a151413a	Neural Networks & Real Project	3	e69ca435-deaf-4603-a97b-e6375ba68773	2025-09-03 13:29:58.524874	2025-09-03 13:29:58.524874	f
c6db231f-e3ab-4f94-9051-36a3a088071d	hooks	4	2e83570e-1ead-44d9-927f-932d1c84e4af	2025-09-15 11:49:42.667897	2025-09-15 11:49:50.779729	t
5d71ab34-4d7b-4ac8-adf7-948872dfbc59	mlkjsmlkjd	5	2e83570e-1ead-44d9-927f-932d1c84e4af	2025-09-15 12:00:49.822919	2025-09-15 12:00:55.519589	t
\.


--
-- Data for Name: notes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notes (id, lesson_slug, user_id, title, content, created_at, updated_at) FROM stdin;
ee438dae-a8fc-4fa3-bffc-e0068416765a	react-props-reusability	user_32C8hRSmiL9y3iS9RBjPb6IwyK1	smflkjsmdklf	sdlmfkjsdkmlfjlksdjfmsdlkjf	2025-09-11 13:23:43.051238+00	2025-09-11 13:23:43.051238+00
7399bdb0-657a-4ad2-a3ac-4d1065f6e232	react-first-component	user_32C8hRSmiL9y3iS9RBjPb6IwyK1	sdmflkjsml	dsflkmsklkjsdd	2025-09-11 13:25:37.055223+00	2025-09-11 13:25:37.055223+00
283026a0-2b71-4130-b512-85fbdedf0bac	react-usestate-hook	user_32C8hRSmiL9y3iS9RBjPb6IwyK1	dkmsljfmdsk	lkkjsdmflkjsdmkf	2025-09-11 13:30:58.743791+00	2025-09-11 13:30:58.743791+00
6f40d308-16e9-40d3-9ba6-783a1489cc8a	react-useeffect-hook	user_32C8hRSmiL9y3iS9RBjPb6IwyK1	kslfmkjdsmkfs	sdlmfkjsmlkfjdsdf	2025-09-12 16:15:17.487224+00	2025-09-12 16:15:17.487224+00
97faea3f-8465-4a42-a4fb-3f0a2e418b53	react-project-components-styling	user_34NBi2LVYJxfbekJqWh4DevAeif	hello	hello\n	2025-10-21 11:01:28.854425+00	2025-10-21 11:01:28.854425+00
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notifications (id, type, title, body, sent_to, content_type, course_id, created_at, updated_at) FROM stdin;
5f553377-257e-4b48-8beb-9fbf5af55113	announcement	fsdfkljsm	sdfkjmklsjfm	all_users	\N	\N	2025-09-15 11:25:22.934658+00	2025-09-15 11:25:22.934658+00
52c06d9e-31b2-4175-b423-d3fde1524f62	announcement	mlkjslkdmjf	kjmlskjf	all_users	\N	\N	2025-09-15 11:29:10.045247+00	2025-09-15 11:29:10.045247+00
\.


--
-- Data for Name: quiz_answers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.quiz_answers (id, user_id, lesson_id, quiz_id, selected_option_index, is_correct, created_at) FROM stdin;
bf414e21-31f0-4e95-8021-901408464a53	user_32C8hRSmiL9y3iS9RBjPb6IwyK1	a79c75ca-2c68-4de1-b377-0cf663b72d04	b53b468e-88a2-49d2-a9e6-d16c6e89959d	1	t	2025-09-04 14:22:29.2363
74eca19e-920e-4a64-b33e-dd10be4a56ff	user_32C8hRSmiL9y3iS9RBjPb6IwyK1	1b422b82-ed36-478c-a033-b368979b6863	6baa56d4-3fb9-47b3-b150-4cce03902904	1	t	2025-09-11 13:30:28.68187
e5784241-207f-49bd-8a76-fd86396e31f1	user_34NBi2LVYJxfbekJqWh4DevAeif	4c1c7cb6-7e84-4090-9ccc-9c228980e7ef	53a76868-37a0-41c1-87fd-d74e6f78e7a9	1	t	2025-10-21 11:00:32.730187
\.


--
-- Data for Name: quizzes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.quizzes (id, lesson_id, question, options, correct_option_index) FROM stdin;
b53b468e-88a2-49d2-a9e6-d16c6e89959d	a79c75ca-2c68-4de1-b377-0cf663b72d04	What is JSX primarily used for in React?	{"Minifying CSS","Embedding HTML-like syntax inside JavaScript","Managing state","Routing between pages"}	1
6baa56d4-3fb9-47b3-b150-4cce03902904	1b422b82-ed36-478c-a033-b368979b6863	Which React Hook should you use to add local state to a functional component?	{useEffect,useState,useContext,useReducer}	1
53a76868-37a0-41c1-87fd-d74e6f78e7a9	4c1c7cb6-7e84-4090-9ccc-9c228980e7ef	When scaffolding a React project with Vite, which command creates a new project?	{"npx create-react-app my-app","npm create vite@latest my-app --template react","npm init react-app my-app","vite init react-app"}	1
f0ba9202-0c78-48e5-a3a7-39af3e787075	2ee858d5-e29c-471d-948a-c4a3033a6f4f	Which JavaScript engine does Node.js use under the hood?	{SpiderMonkey,Chakra,V8,JavaScriptCore}	2
6199610e-1bc3-468a-a50a-a0f448c6045d	8b84eaa3-f37d-43bf-81f7-4dd15878963c	Which HTTP method is conventionally used to create a new resource in a REST API?	{GET,POST,PUT,DELETE}	1
5dc435bd-5161-4b8d-bc6e-ebc55947d1b9	292ccc37-ffed-4719-8eba-e2e46647244d	MongoDB stores documents in which native format?	{XML,JSON/BSON,CSV,YAML}	1
1d5d3034-14ca-4c0b-971a-3e4fbb142990	796a79b9-6bc4-4e1e-8321-bbecd69d1e3e	Which metric measures when the largest contentful element becomes visible?	{"First Contentful Paint (FCP)","Largest Contentful Paint (LCP)","Cumulative Layout Shift (CLS)","Time to Interactive (TTI)"}	1
340a8f1c-2ffe-4a0f-acb4-4c0f1252a0a2	1e338e92-5bb3-4c33-9a77-725bc300e846	Which modern image format typically gives the best compression for web images?	{JPEG,PNG,GIF,WebP/AVIF}	3
3a47bd3c-5438-4ad0-9813-71a9cf16bbc6	b77656fb-eb89-4b7a-9d37-a13057452fc4	What is the primary benefit of code splitting?	{"Reduce initial bundle size by loading code on demand","Automatically generate API docs","Improve server-side rendering","Enforce strict typing"}	0
\.


--
-- Data for Name: user_achievements; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_achievements (id, user_id, achievement_id, unlocked_at) FROM stdin;
2a40ec3c-1f3d-440d-afb4-660bf5ac6b16	user_32C8hRSmiL9y3iS9RBjPb6IwyK1	a2caa9ad-d8eb-4d59-8168-8375df9aa58b	2025-09-04 14:50:06.85909
9b17ea64-c4f4-4919-9def-e7589c29f3fa	user_34NBi2LVYJxfbekJqWh4DevAeif	a2caa9ad-d8eb-4d59-8168-8375df9aa58b	2025-10-21 11:00:44.710048
\.


--
-- Data for Name: user_notification; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_notification (id, notification_id, user_id, is_read, created_at) FROM stdin;
f01f9039-47de-4108-a2e1-4889de381e64	5f553377-257e-4b48-8beb-9fbf5af55113	user_31pQUtndulxJVejogaBQNwGNiHz	f	2025-09-15 11:25:33.577725
db2a2bf5-d4e7-4340-980b-db732d2c93ba	5f553377-257e-4b48-8beb-9fbf5af55113	user_32EUbg3mrpDSWJ7FUNNKzjUVscf	f	2025-09-15 11:25:33.577725
f39a5551-1ba2-4a23-ad56-f114e8d56c1d	5f553377-257e-4b48-8beb-9fbf5af55113	user_32EkzBgLAdkNPRtq29dncF6Voi0	f	2025-09-15 11:25:33.577725
79a427f9-163a-4acd-9d72-86907702497d	5f553377-257e-4b48-8beb-9fbf5af55113	user_32C8hRSmiL9y3iS9RBjPb6IwyK1	t	2025-09-15 11:25:33.577725
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, name, avatar_url, created_at, email, clerk_id, streak_count, last_study_date, xp, level, bio, role, status) FROM stdin;
bea25de0-279c-4ebd-a1c0-474442aeb3a6	Matela Abdelhafid	https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18zNE5CaTZkSmhBbVVKME9aTDJwVThkekRSakYifQ	2025-10-21 10:58:17.029038+00	abdou26072001@gmail.com	user_34NBi2LVYJxfbekJqWh4DevAeif	0	2025-10-21	80	1	Passionate learner exploring new technologies and expanding my knowledge every day. Currently focusing on web development	student	active
2949da92-e8a6-493b-9696-08fe8ab5902b	demo admin	https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18yeGs4S3VvQTRaamtrVnY2QXZSaTJWVDNqQ2IiLCJyaWQiOiJ1c2VyXzMxcFFVdG5kdWx4SlZlam9nYUJRTndHTmlIeiIsImluaXRpYWxzIjoiREEifQ	2025-09-03 14:39:14.417687+00	demo@devlevelup.com	user_31pQUtndulxJVejogaBQNwGNiHz	0	2025-09-03	1000	10	Passionate learner exploring new technologies and expanding my knowledge every day. Currently focusing on web development	student	active
3edec273-dd6b-4b78-891a-4214099f17f1	adda Js	https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18zMkM4aFFQbkQ4UHpBZTlqSXFVRGxJTmE1YlQifQ	2025-09-03 15:28:36.32636+00	addajs48@gmail.com	user_32C8hRSmiL9y3iS9RBjPb6IwyK1	0	2025-09-12	170	2	Passionate learner exploring new technologies and expanding my knowledge every day. Currently focusing on web development	admin	active
e08847ec-c685-47d6-bb9d-a7ddc896e2c9	miss adda	https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvdXBsb2FkZWQvaW1nXzMyRVVxSTVKYUV4RW5jSXEyMzFpUWRsZmhyWiJ9	2025-09-04 11:28:19.9348+00	missoumadda49@gmail.com	user_32EUbg3mrpDSWJ7FUNNKzjUVscf	0	\N	0	0	Passionate learner exploring new technologies and expanding my knowledge every day. Currently focusing on web development	student	active
e63b7875-bd16-4feb-b161-98c41230988a	Driss Missoum	https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18zMkVrekJWdms5MExuZ1ZEUTlmM2xxdkFicVMifQ	2025-09-04 13:43:22.408124+00	yaminasedik@gmail.com	user_32EkzBgLAdkNPRtq29dncF6Voi0	0	\N	0	0	Passionate learner exploring new technologies and expanding my knowledge every day. Currently focusing on web development	student	active
15271a3d-e679-401e-8d3d-7bac27df2fd7	Smail Hezil	https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18zM0ZTUmtDd3V2WTJRQkJKMUhHdVdkdXdwekYifQ	2025-09-26 18:30:01.242872+00	smailhezil00@gmail.com	user_33FSRgltlGIagMSJmdiwqBjoNjG	0	\N	0	0	Passionate learner exploring new technologies and expanding my knowledge every day. Currently focusing on web development	student	active
9efc96bf-61c5-4c56-ac4f-a34ddce4f918	hecin ali	https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18zM0hteXN0WDFHaG5UUGdUNHpBSFFsMGphNWcifQ	2025-09-27 14:17:33.227951+00	hecinali5@gmail.com	user_33HmyvIfAC7bIpbnjFob08mQ3tj	0	\N	0	0	Passionate learner exploring new technologies and expanding my knowledge every day. Currently focusing on web development	student	active
\.


--
-- Data for Name: xp_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.xp_logs (id, user_id, source, xp_earned, created_at) FROM stdin;
47536ad0-83b5-48d7-9e8f-b62f51778381	user_32C8hRSmiL9y3iS9RBjPb6IwyK1	quizz_completed	50	2025-09-04 14:22:29.2363
1ee7e058-ae72-4eff-b473-5574a5604725	user_32C8hRSmiL9y3iS9RBjPb6IwyK1	lesson_complete	10	2025-09-04 14:50:06.85909
ea21ddbb-d845-4b67-8bbc-1db4b1e6df56	user_32C8hRSmiL9y3iS9RBjPb6IwyK1	first_lesson	20	2025-09-04 14:50:06.85909
e51a47bc-320b-49e1-932d-78c6b0056a5e	user_32C8hRSmiL9y3iS9RBjPb6IwyK1	lesson_complete	10	2025-09-11 13:23:14.632677
4c96fb21-0705-4029-aea1-b34a6ebf1f7b	user_32C8hRSmiL9y3iS9RBjPb6IwyK1	lesson_complete	10	2025-09-11 13:25:15.137604
3863647d-02fb-42bb-9a17-ae1f9efada84	user_32C8hRSmiL9y3iS9RBjPb6IwyK1	quizz_completed	50	2025-09-11 13:30:28.68187
3bd53fcc-7a28-4142-9329-6cffe7f47cdd	user_32C8hRSmiL9y3iS9RBjPb6IwyK1	lesson_complete	10	2025-09-11 13:30:39.245535
a49d3880-d7a7-4903-9bcb-3a40bc870d8a	user_32C8hRSmiL9y3iS9RBjPb6IwyK1	lesson_complete	10	2025-09-12 16:14:48.458971
d99ab0d2-6c58-4c93-86ed-9b0adba7dd8b	user_34NBi2LVYJxfbekJqWh4DevAeif	quizz_completed	50	2025-10-21 11:00:32.730187
08e5a035-73c3-43b2-bde4-466517fbbdd4	user_34NBi2LVYJxfbekJqWh4DevAeif	lesson_complete	10	2025-10-21 11:00:44.710048
2bf54f21-0dc5-4dfb-a238-a212376b412f	user_34NBi2LVYJxfbekJqWh4DevAeif	first_lesson	20	2025-10-21 11:00:44.710048
\.


--
-- Name: achievements achievements_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.achievements
    ADD CONSTRAINT achievements_code_key UNIQUE (code);


--
-- Name: achievements achievements_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.achievements
    ADD CONSTRAINT achievements_pkey PRIMARY KEY (id);


--
-- Name: course_save course_save_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_save
    ADD CONSTRAINT course_save_pkey PRIMARY KEY (id);


--
-- Name: courses courses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_pkey PRIMARY KEY (id);


--
-- Name: courses courses_slug_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_slug_key UNIQUE (slug);


--
-- Name: enrollments enrollments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.enrollments
    ADD CONSTRAINT enrollments_pkey PRIMARY KEY (id);


--
-- Name: enrollments enrollments_user_id_course_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.enrollments
    ADD CONSTRAINT enrollments_user_id_course_id_key UNIQUE (user_id, course_id);


--
-- Name: folders folders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.folders
    ADD CONSTRAINT folders_pkey PRIMARY KEY (id);


--
-- Name: lesson_progress lesson_progress_enrollment_id_module_id_lesson_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lesson_progress
    ADD CONSTRAINT lesson_progress_enrollment_id_module_id_lesson_id_key UNIQUE (enrollment_id, module_id, lesson_id);


--
-- Name: lesson_progress lesson_progress_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lesson_progress
    ADD CONSTRAINT lesson_progress_pkey PRIMARY KEY (id);


--
-- Name: lessons lessons_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lessons
    ADD CONSTRAINT lessons_pkey PRIMARY KEY (id);


--
-- Name: lessons lessons_slug_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lessons
    ADD CONSTRAINT lessons_slug_key UNIQUE (slug);


--
-- Name: module_progress module_progress_enrollment_id_module_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.module_progress
    ADD CONSTRAINT module_progress_enrollment_id_module_id_key UNIQUE (enrollment_id, module_id);


--
-- Name: module_progress module_progress_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.module_progress
    ADD CONSTRAINT module_progress_pkey PRIMARY KEY (id);


--
-- Name: modules modules_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.modules
    ADD CONSTRAINT modules_pkey PRIMARY KEY (id);


--
-- Name: notes notes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notes
    ADD CONSTRAINT notes_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: quiz_answers quiz_answers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quiz_answers
    ADD CONSTRAINT quiz_answers_pkey PRIMARY KEY (id);


--
-- Name: quiz_answers quiz_answers_quiz_id_lesson_id_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quiz_answers
    ADD CONSTRAINT quiz_answers_quiz_id_lesson_id_user_id_key UNIQUE (quiz_id, lesson_id, user_id);


--
-- Name: quizzes quizzes_lesson_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quizzes
    ADD CONSTRAINT quizzes_lesson_id_key UNIQUE (lesson_id);


--
-- Name: quizzes quizzes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quizzes
    ADD CONSTRAINT quizzes_pkey PRIMARY KEY (id);


--
-- Name: course_save unique_course_in_folder; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_save
    ADD CONSTRAINT unique_course_in_folder UNIQUE (folder_id, course_id);


--
-- Name: modules unique_course_module_title; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.modules
    ADD CONSTRAINT unique_course_module_title UNIQUE (course_id, title);


--
-- Name: lessons unique_slug_topic_id; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lessons
    ADD CONSTRAINT unique_slug_topic_id UNIQUE (slug, topic_id);


--
-- Name: notes unique_user_lesson; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notes
    ADD CONSTRAINT unique_user_lesson UNIQUE (user_id, lesson_slug);


--
-- Name: user_achievements user_achievements_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_achievements
    ADD CONSTRAINT user_achievements_pkey PRIMARY KEY (id);


--
-- Name: user_achievements user_achievements_user_id_achievement_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_achievements
    ADD CONSTRAINT user_achievements_user_id_achievement_id_key UNIQUE (user_id, achievement_id);


--
-- Name: user_notification user_notification_notification_id_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_notification
    ADD CONSTRAINT user_notification_notification_id_user_id_key UNIQUE (notification_id, user_id);


--
-- Name: user_notification user_notification_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_notification
    ADD CONSTRAINT user_notification_pkey PRIMARY KEY (id);


--
-- Name: users users_clerk_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_clerk_id_key UNIQUE (clerk_id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: xp_logs xp_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.xp_logs
    ADD CONSTRAINT xp_logs_pkey PRIMARY KEY (id);


--
-- Name: idx_course_save_cf; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_course_save_cf ON public.course_save USING btree (course_id, folder_id);


--
-- Name: idx_courses_level_category; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_courses_level_category ON public.courses USING btree (level, category);


--
-- Name: idx_courses_published; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_courses_published ON public.courses USING btree (is_published);


--
-- Name: idx_courses_slug; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_courses_slug ON public.courses USING btree (slug);


--
-- Name: idx_folders_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_folders_user ON public.folders USING btree (user_id);


--
-- Name: idx_lessons_slug_topic; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_lessons_slug_topic ON public.lessons USING btree (slug, topic_id);


--
-- Name: idx_lessons_topic_order; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_lessons_topic_order ON public.lessons USING btree (topic_id, order_index);


--
-- Name: idx_lp_completion; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_lp_completion ON public.lesson_progress USING btree (enrollment_id, completed, lesson_id);


--
-- Name: idx_lp_enrollment_lesson; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_lp_enrollment_lesson ON public.lesson_progress USING btree (enrollment_id, lesson_id);


--
-- Name: idx_lp_enrollment_module; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_lp_enrollment_module ON public.lesson_progress USING btree (enrollment_id, module_id);


--
-- Name: idx_modules_course; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_modules_course ON public.modules USING btree (course_id);


--
-- Name: idx_modules_course_order; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_modules_course_order ON public.modules USING btree (course_id, order_index);


--
-- Name: idx_mp_enrollment_module; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_mp_enrollment_module ON public.module_progress USING btree (enrollment_id, module_id);


--
-- Name: idx_quiz_answers_lesson_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_quiz_answers_lesson_user ON public.quiz_answers USING btree (lesson_id, user_id);


--
-- Name: idx_quiz_answers_quiz_lesson_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_quiz_answers_quiz_lesson_user ON public.quiz_answers USING btree (quiz_id, lesson_id, user_id);


--
-- Name: idx_quizzes_lesson_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_quizzes_lesson_id ON public.quizzes USING btree (lesson_id);


--
-- Name: idx_users_clerk_laststudy; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_clerk_laststudy ON public.users USING btree (clerk_id, last_study_date);


--
-- Name: course_save course_save_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_save
    ADD CONSTRAINT course_save_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;


--
-- Name: course_save course_save_folder_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_save
    ADD CONSTRAINT course_save_folder_id_fkey FOREIGN KEY (folder_id) REFERENCES public.folders(id) ON DELETE CASCADE;


--
-- Name: enrollments enrollments_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.enrollments
    ADD CONSTRAINT enrollments_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;


--
-- Name: enrollments enrollments_current_module_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.enrollments
    ADD CONSTRAINT enrollments_current_module_id_fkey FOREIGN KEY (current_module_id) REFERENCES public.modules(id);


--
-- Name: enrollments enrollments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.enrollments
    ADD CONSTRAINT enrollments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(clerk_id) ON DELETE CASCADE;


--
-- Name: folders folders_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.folders
    ADD CONSTRAINT folders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(clerk_id) ON DELETE CASCADE;


--
-- Name: lesson_progress lesson_progress_enrollment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lesson_progress
    ADD CONSTRAINT lesson_progress_enrollment_id_fkey FOREIGN KEY (enrollment_id) REFERENCES public.enrollments(id) ON DELETE CASCADE;


--
-- Name: lesson_progress lesson_progress_lesson_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lesson_progress
    ADD CONSTRAINT lesson_progress_lesson_id_fkey FOREIGN KEY (lesson_id) REFERENCES public.lessons(id) ON DELETE CASCADE;


--
-- Name: lesson_progress lesson_progress_module_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lesson_progress
    ADD CONSTRAINT lesson_progress_module_id_fkey FOREIGN KEY (module_id) REFERENCES public.modules(id) ON DELETE CASCADE;


--
-- Name: lessons lessons_topic_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lessons
    ADD CONSTRAINT lessons_topic_id_fkey FOREIGN KEY (topic_id) REFERENCES public.modules(id);


--
-- Name: module_progress module_progress_enrollment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.module_progress
    ADD CONSTRAINT module_progress_enrollment_id_fkey FOREIGN KEY (enrollment_id) REFERENCES public.enrollments(id) ON DELETE CASCADE;


--
-- Name: module_progress module_progress_module_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.module_progress
    ADD CONSTRAINT module_progress_module_id_fkey FOREIGN KEY (module_id) REFERENCES public.modules(id) ON DELETE CASCADE;


--
-- Name: modules modules_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.modules
    ADD CONSTRAINT modules_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;


--
-- Name: notes notes_lesson_slug_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notes
    ADD CONSTRAINT notes_lesson_slug_fkey FOREIGN KEY (lesson_slug) REFERENCES public.lessons(slug);


--
-- Name: notes notes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notes
    ADD CONSTRAINT notes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(clerk_id) ON DELETE CASCADE;


--
-- Name: notifications notifications_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE SET NULL;


--
-- Name: quiz_answers quiz_answers_lesson_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quiz_answers
    ADD CONSTRAINT quiz_answers_lesson_id_fkey FOREIGN KEY (lesson_id) REFERENCES public.lessons(id);


--
-- Name: quiz_answers quiz_answers_quiz_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quiz_answers
    ADD CONSTRAINT quiz_answers_quiz_id_fkey FOREIGN KEY (quiz_id) REFERENCES public.quizzes(id);


--
-- Name: quiz_answers quiz_answers_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quiz_answers
    ADD CONSTRAINT quiz_answers_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(clerk_id) ON DELETE CASCADE;


--
-- Name: quizzes quizzes_lesson_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quizzes
    ADD CONSTRAINT quizzes_lesson_id_fkey FOREIGN KEY (lesson_id) REFERENCES public.lessons(id) ON DELETE CASCADE;


--
-- Name: user_achievements user_achievements_achievement_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_achievements
    ADD CONSTRAINT user_achievements_achievement_id_fkey FOREIGN KEY (achievement_id) REFERENCES public.achievements(id);


--
-- Name: user_achievements user_achievements_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_achievements
    ADD CONSTRAINT user_achievements_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(clerk_id) ON DELETE CASCADE;


--
-- Name: user_notification user_notification_notification_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_notification
    ADD CONSTRAINT user_notification_notification_id_fkey FOREIGN KEY (notification_id) REFERENCES public.notifications(id) ON DELETE CASCADE;


--
-- Name: user_notification user_notification_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_notification
    ADD CONSTRAINT user_notification_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(clerk_id) ON DELETE CASCADE;


--
-- Name: xp_logs xp_logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.xp_logs
    ADD CONSTRAINT xp_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(clerk_id) ON DELETE CASCADE;


