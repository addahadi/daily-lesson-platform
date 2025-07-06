import { useUser } from "@clerk/clerk-react";
import { createContext, useEffect, useState } from "react";


const enrollContext = createContext(undefined)


const EnrollProvider = () => {
    const [enrollmentId , setEnrollmentId] = useState()
    const {user} = useUser()
    useEffect(() => {
        
    }, [user])
}