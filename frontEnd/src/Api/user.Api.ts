

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
                console.log(data)
                return data;
            }
        }
        catch (error) {
            console.error('Error enrolling to course:', error);
        }
    }
    return {
        EnrollToCourse
    }
}