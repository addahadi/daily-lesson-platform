export const lessonApiController = () => {
    const getLessonDetails = async (lessonId : string) => {
        console.log(lessonId)
        const URL = `http://localhost:8090/lesson/get/${lessonId}`;
      try {
        const response = await fetch(URL, {
          method: "GET",
        });
        if (response.ok) {
          const result = await response.json();
          const { data } = result;
          return data;
        }
      }
      catch (err) {
      console.log(err);
      }
    }

    const getLessonsDetails = async (courseId : string) => {
      const URL = `http://localhost:8090/lesson/getlessons/${courseId}`;
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
    const getFirstLessonId = async (courseId: string) => {
      const URL = `http://localhost:8090/lesson/getfirstlesson/${courseId}`;
      try {
        const response = await fetch(URL, {
          method: "GET",
        });
        if (response.ok) {
          const result = await response.json();
          return result;
        }
      } catch (err) {
        console.log(err);
      }
    };
    
    const checkValidLesson = async (courseId : string , moduleId : string , userId : string) => {
      const requestBody = {
        courseId ,
        moduleId ,
        userId
      }
      const URL = `http://localhost:8090/lesson/checklesson`;
      try {
        const response = await fetch(URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });
        if (response.ok) {
          const result = await response.json();
          return result;
        }
      } catch (err) {
        console.log(err);
      }
    }
    const startLesson = async (enrollmentId : string , moduleId : string, lessonId : string) => {
      const requestBody = {
        enrollmentId,
        moduleId,
        lessonId,
      };
      const URL = `http://localhost:8090/lesson/startlesson`;
      try {
        const response = await fetch(URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });
        if (response.ok) {
          const result = await response.json();
          return result;
        }
      } catch (err) {
        console.log(err);
      }
    }
    return {
        getLessonDetails,
        getLessonsDetails,
        getFirstLessonId,
        checkValidLesson,
        startLesson
    }
}
