import useAnalyticApi from "@/admin/api/analytics"
import { useEffect, useState } from "react"



const useAnalytic = () => {
    const [streakAnalyticData , setStreakAnalyticData] = useState<Record<string , string | number>| null>( null)
    const [lessonAnalyticData , setLessonAnalyticData] = useState<Record<string , string | number>| null>(null)
    const [userAnalyticData , setUserAnalyticData] = useState<Record<string , string | number> | null>(null)
    const [error , setError] = useState('')
    const [chartData , setChartData] = useState<Record<string , number> | never[] >([])
    const [loading , setLoading] = useState(false)
    const {

        getLessonAnalyticData , 
        getUserAnalyticData,
        getStreakAnalyticData,
        getChartData
    } = useAnalyticApi()

    useEffect(() => {

        async function fetchData(){
            try {
                setLoading(true)
                const [streak, lesson, user , chart] = await Promise.all([
                  getStreakAnalyticData(),
                  getLessonAnalyticData(),
                  getUserAnalyticData(),
                  getChartData(),
                ]);

                setStreakAnalyticData(streak)
                setLessonAnalyticData(lesson)
                setUserAnalyticData(user)
                console.log(chart)
                if(chart !== null){
                    setChartData(chart)
                }
                console.log(streak , lesson , user)
            }
            catch(err){
                setError("Something went wrong. Try again later.");
            }
            finally{
                setLoading(false)
            }
        }
        fetchData()
    }, [getLessonAnalyticData , getStreakAnalyticData , getUserAnalyticData])
    return {
        streakAnalyticData , 
        lessonAnalyticData,
        userAnalyticData , 
        loading,
        chartData
    }
}

export default useAnalytic