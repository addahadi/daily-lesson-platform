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
    return {
        getLessonDetails
    }
}
