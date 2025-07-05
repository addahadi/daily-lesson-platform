


import { userApiController } from '@/Api/user.Api'
import { useEffect, useState } from 'react'

const useEnroll = (courseId : string | undefined , userId : string | undefined) => {
    const [enrollmentId , setEnrollmentId] = useState<string | undefined>()

    useEffect(() => {
        async function fetchData(){
            try {
                if(!courseId || !userId) return 
                const data = await userApiController().getEnroll(courseId , userId)
                
                setEnrollmentId(data[0].enrollmentid)
            }
            catch(err) {
                console.log(err)
            }
        }
        fetchData()
    },[courseId , userId])
    return {enrollmentId}
}

export default useEnroll