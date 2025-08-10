const CourseCategory =  [
  "Frontend",
  "Backend",
  "Fullstack",
  "Mobile Development",
  "Data Science & AI",
  "DevOps & Cloud",
  "Cybersecurity",
  "Game Development",

]


export const categorySlugs = CourseCategory.map(
  (cat) =>
    cat
      .toLowerCase()
      .replace(/&/g, "and") 
      .replace(/\s+/g, "-") 
      .replace(/[^a-z0-9-]/g, "") 
);