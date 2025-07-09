import { useAuth } from "@clerk/clerk-react";

const useUserApi = () => {
    const { getToken } = useAuth();

    const getAuthHeader = async () => {
      const token = await getToken();
      return {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };
    };

    const getUsers = async () => {
      const URL = `http://localhost:8090/admin/user/`;
      try {
        const headers = await getAuthHeader();
        const response = await fetch(URL, { method: "GET", headers });

        if (response.ok) {
          const result = await response.json();
          return result.data;
        } 
      } catch (err) {
        console.error(err);
      }
    };
    
    
    const deleteUser = async (userId : string) => {
      const URL = `http://localhost:8090/admin/user/${userId}`;
      console.log("hih")
      try {
        const headers = await getAuthHeader();
        await fetch(URL, { method: "DELETE", headers });
      } catch (err) {
        console.error(err);
      }
    };
    const updateUser = async (userId : string , role : string , status : string) => {
      const requestBody = {
        role,
        status
      }
      const URL = `http://localhost:8090/admin/user/${userId}`;
      try {
        const headers = await getAuthHeader();
        const response = await fetch(URL, { method: "POST", headers , body : JSON.stringify(requestBody) });

        if (response.ok) {
          const result = await response.json();
          return result.data;
        }
      } catch (err) {
        console.error(err);
      }
    };
    return {
        getUsers,
        updateUser, 
        deleteUser
    }
}


export default useUserApi