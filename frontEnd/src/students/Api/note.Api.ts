const noteApiController = () => {


    const getAllNotes = async (userId : string , page : number) => {
      const URL = `http://localhost:8090/note/all-notes?userId=${userId}&page=${page}`;
      try {
        const response = await fetch(URL, {
          method: "GET",
        });
        if (response.ok) {
          const result = await response.json();
          const { data } = result;
          return data;
        } else if (response.status === 404) {
          return null
        }
      } catch (err) {
        console.log(err);
      }
    }
    const getLessonNote = async (lessonId : string , userId : string) => { 
      
      const URL = `http://localhost:8090/note/lesson-note/${lessonId}/${userId}`;
      try {
        const response = await fetch(URL, {
          method: "GET",
          
        });
        if (response.ok) {
          const result = await response.json();
          const {data} = result
          return data;
        }
      } catch (err) {
        console.log(err);
      }
    }
    const addNote = async (
      title: string,
      content: string,
      lessonId: string,
      userId: string
    ) => {
      const requestBody = {
        content,
        title,
        lessonId,
        userId,
      };
      const URL = `http://localhost:8090/note/add-note`;
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
    };
    return {
        addNote,
        getLessonNote,
        getAllNotes
    }
}

export default noteApiController