
const profileApiController = () => {
    const getUserInfo = async (userId : string) => {
        try {
          const response = await fetch(
            `http://localhost:8090/auth/user-info/${userId}`,
            {
              method: "GET",
            }
          );
          if (response.ok) {
            const result = await response.json();
            const {data} = result
            return data;
          }
        } catch (error) {
          console.error("Error enrolling to course:", error);
        }
    }
    const getUserAchievements = async (userId : string) => {
      try {
        const response = await fetch(
          `http://localhost:8090/auth/user-achievements/${userId}`,
          {
            method: "GET",
          }
        );
        if (response.ok) {
          const result = await response.json();
          const { data } = result;
          return data;
        }
      } catch (error) {
        console.error("Error enrolling to course:", error);
      }
    }
    const getXpLogs = async (userId : string) => {
      try {
        const response = await fetch(
          `http://localhost:8090/auth/xp-logs/${userId}`,
          {
            method: "GET",
          }
        );
        if (response.ok) {
          const result = await response.json();
          const { data } = result;
          return data;
        }
      } catch (error) {
        console.error("Error enrolling to course:", error);
      }
    }
    return {
        getUserInfo , 
        getUserAchievements,
        getXpLogs
    }
}

export default profileApiController