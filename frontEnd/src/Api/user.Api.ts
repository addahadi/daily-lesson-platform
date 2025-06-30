

export const userApiController = () => {
    const EnrollToCourse = async (courseId: string , userId: string) => {
        const requestBody = {
            courseId: courseId,
            userId: userId,
        }
        try {
            const response = await fetch(`http://localhost:8090/auth/enroll`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body : JSON.stringify(requestBody),
            });
            if (response.ok) {
                const data = await response.json();
                return data;
            }
        }
        catch (error) {
            console.error('Error enrolling to course:', error);
        }
    }

    const checkEnroll = async (courseId : string , userId : string) => {
        try {
            const response = await fetch(`http://localhost:8090/auth/checkenroll?courseId=${courseId}&userId=${userId}`, {
                method: 'GET',
            });
            if (response.ok) {
                const data = await response.json();
                return data;
            }
        }
        catch (error) {
            console.error('Error enrolling to course:', error);
        }
    }
    const getEnroll = async (courseId : string , userId : string) => {
        try {
          const response = await fetch(
            `http://localhost:8090/auth/getenroll?courseId=${courseId}&userId=${userId}`,
            {
              method: "GET",
            }
          );
          if (response.ok) {
            const data = await response.json();
            return data;
          }
        } catch (error) {
          console.error("Error enrolling to course:", error);
        }
    }
    return {
        EnrollToCourse,
        checkEnroll,
        getEnroll,
    }
}