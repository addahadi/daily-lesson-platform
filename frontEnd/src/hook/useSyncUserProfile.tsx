import { useEffect } from 'react'
import { useUser } from "@clerk/clerk-react";
const useSyncUserProfile = () => {
    const {isSignedIn , user} = useUser()
    useEffect(() => {
         const syncUser = async () => {
            if(isSignedIn && user){
                const {id,fullName,imageUrl,emailAddresses} = user
                const alreadySynced = localStorage.getItem(
                  `user-synced-${user.id}`
                );
                if(!alreadySynced){
                    console.log("yesyes")
                    const requestBody = {
                        id , fullName , imageUrl , emailAddresses
                    }
                    try {
                        const response = await fetch("http://localhost:8090/auth/signup", {
                            method : "POST",
                            headers: {
                                'Content-Type': 'application/json',  
                            },
                            body : JSON.stringify(requestBody)
                        })
                        if(response.ok){
                            const result = await response.json()
                            localStorage.setItem(
                                `user-synced-${user.id}`,
                                "true"
                            );
                            console.log(result)

                        }
                    }
                    catch(err){
                        console.log(err)
                    }
                }
            }

        }
        syncUser()

    },[user , isSignedIn])
}

export default useSyncUserProfile