export const lessonApiController = () => {
    const getLessonDetails = async (lessonId : string , userId : string) => {
        const queryParams = new URLSearchParams({
        userId, 
        lessonId,
       
      });
      console.log(userId , lessonId)
        const URL = `http://localhost:8090/lesson/get?${queryParams}`;
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

    const getLessonsDetails = async (courseId : string , enrollmentId : string) => {
      const URL = `http://localhost:8090/lesson/getlessons?courseId=${courseId}&enrollmentId=${enrollmentId}`;
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
      console.log(requestBody)
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
          console.log(result)
          return result;
        }
      } catch (err) {
        console.log(err);
      }
    }
    const SubmitQuizzAnswer = async (
      quizz_id: string,
      user_id: string,
      lesson_id: string,
      selected_option_index: number,
      is_correct: boolean,
      module_id : string
    ) => {
      const queryParams = new URLSearchParams({
        quizz_id,
        user_id,
        lesson_id,
        selected_option : selected_option_index.toString(),
        correct : is_correct.toString(),
        module_id : module_id
      });

      const URL = `http://localhost:8090/lesson/submitanswer?${queryParams.toString()}`;

      try {
        const response = await fetch(URL, {
          method: "GET", 
        });

        if (response.ok) {
          const result = await response.json();
          return result;
        } else {
          console.error("Failed response", response.status);
        }
      } catch (err) {
        console.error("Fetch error", err);
      }
    };
    
    const getNextLesson = async (order_index: number , module_id : string) => {
      const URL = `http://localhost:8090/lesson/nextlesson/${module_id}/${order_index}`;
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

     const markAsComplete = async (enrollmentId : string , moduleId : string , lessonId : string , userId : string) => {
      const requestBody = {
        enrollmentId,
        moduleId,
        lessonSlug : lessonId,
        userId
      };
      const URL = `http://localhost:8090/lesson/markascomplete`;
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
        startLesson,
        SubmitQuizzAnswer,
        getNextLesson,
        markAsComplete
    }
}
