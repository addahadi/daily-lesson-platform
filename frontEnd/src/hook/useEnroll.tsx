


import { userApiController } from '@/Api/user.Api'
import React, { useEffect, useState } from 'react'

const useEnroll = (courseId : string , userId : string) => {
    const [enrollmentId , setEnrollmentId] = useState<string | undefined>()

    useEffect(() => {
        async function fetchData(){
            try {
                const response = await userApiController().getEnroll(courseId , userId)
                const {data} = response
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