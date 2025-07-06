const homeApiController = () => {
    const getEnrolledCourses = async (userId : string) => {
        const URL = `http://localhost:8090/home/enrolled-courses/${userId}`;
      try {
        const response = await fetch(URL, {
          method: "GET",
        });
        if (response.ok) {
          const result = await response.json();
          const { data } = result;
          return data;
        } else if (response.status === 404){
          console.warn(`No Course found`);

          return null
        }
      }
      catch (err) {
      console.log(err);
      }
    }
    const getEnrolledCoursesNumber = async (userId : string) => {
      const URL = `http://localhost:8090/home/total-enrolled-courses/${userId}`;
      try {
        const response = await fetch(URL, {
          method: "GET",
        });
        if (response.ok) {
          const result = await response.json();
          const { data } = result;
          return data;
        }
      } catch (err) {
        console.log(err);
      }
    }
    const getNextLesson = async (courseId : string , enrollmentId : string) => {
      const URL = `http://localhost:8090/home/next-lessons?courseId=${courseId}&enrollmentId=${enrollmentId}`;
      try {
        console.log(courseId , enrollmentId)
        const response = await fetch(URL, {
          method: "GET",
        });
        if (response.ok) {
          const result = await response.json();
          const { data } = result;
          return data;
        } else if (response.status === 404){
          console.warn(`No next lesson found for course ${courseId}`);
          return null;
        }
      } catch (err) {
        console.log(err);
      }
    }
    const getTotalLessons = async (userId: string) => {
      const URL = `http://localhost:8090/home/total-lessons/${userId}`;
      try {
        const response = await fetch(URL, {
          method: "GET",
        });
        if (response.ok) {
          const result = await response.json();
          const { data } = result;
          return data;
        }
      } catch (err) {
        console.log(err);
      }
    };
    const getDailyStreak = async (userId: string) => {
      const URL = `http://localhost:8090/home/streak-days/${userId}`;
      try {
        const response = await fetch(URL, {
          method: "GET",
        });
        if (response.ok) {
          const result = await response.json();
          const { data } = result;
          return data;
        }
      } catch (err) {
        console.log(err);
      }
    };
    return {
        getEnrolledCourses,
        getNextLesson,
        getEnrolledCoursesNumber,
        getTotalLessons,
        getDailyStreak
    }
}


export default homeApiController