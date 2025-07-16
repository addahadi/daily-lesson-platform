const sql = require("../../db")


const getLessonStatistics = async (req , res , next) => {
  try {
    await sql.begin( async (client) => {
      const [{ completed_lessons }] =
        await client`SELECT COUNT(*) AS completed_lessons FROM lesson_progress WHERE completed = true`;
      const [{ total_lessons }] =
        await client`SELECT COUNT(*) AS total_lessons FROM lessons`;



      const [{ this_week }] = await client`
        SELECT COUNT(*) AS this_week
        FROM lesson_progress
        WHERE completed_at >= NOW() - INTERVAL '7 days'`;


      const [{ last_week }] = await client`
        SELECT COUNT(*) AS last_week
        FROM lesson_progress
        WHERE completed_at >= NOW() - INTERVAL '14 days'
          AND completed_at < NOW() - INTERVAL '7 days'`;

      const percent_change =
        last_week > 0
          ? ((this_week - last_week) / last_week) * 100
          : this_week > 0
          ? 100
          : 0;

      
      res.status(200).json({
        status : true,
        data : {
          completed_lessons ,
          total_lessons,
          percent_change
        }
      })

    })

  } catch (error) {
    next(error)
  }
};




const getUserStatistics = async (req, res, next) => {
  try {
    await sql.begin(async (client) => {

      const [{ active_users }] =
        await client`SELECT COUNT(*) AS active_users FROM users WHERE status = 'active'`;
        const [{ total_users }] =
        await client`SELECT COUNT(*) AS total_users FROM users`;
      
      res.status(200).json({
        status : true,
        data :{
          active_users,
          total_users
        }
      });
    });
  } catch (error) {
    next(error);
  }
};


const getStreaksStatistics = async (req, res, next) => {
  try {
    await sql.begin(async (client) => {
      const [{ average_streaks }] = await client`
        SELECT AVG(streak_count)::float AS average_streaks FROM users
      `;

      const [{ this_week }] = await client`
        SELECT COUNT(*) AS this_week
        FROM users
        WHERE last_study_date IS NOT NULL
          AND last_study_date >= NOW() - INTERVAL '7 days'
      `;

      const [{ last_week }] = await client`
        SELECT COUNT(*) AS last_week
        FROM users
        WHERE last_study_date IS NOT NULL
          AND last_study_date >= NOW() - INTERVAL '14 days'
          AND last_study_date < NOW() - INTERVAL '7 days'
      `;

      const percent_change =
        last_week > 0
          ? ((this_week - last_week) / last_week) * 100
          : this_week > 0
          ? 100
          : 0;

      res.status(200).json({
        status : true ,
        data : {
          average_streaks,
          percent_change,
        }
      });
    });
  } catch (err) {
    next(err);
  }
};


const getChartData = async (req , res , next) =>  {
  try {
    const chartData = await sql`
        SELECT
        completed_at::date AS date,
        COUNT(*) AS completed
        FROM lesson_progress
        WHERE completed = true
        GROUP BY completed_at::date
        ORDER BY completed_at::date DESC
        LIMIT 7;    
    `;
    if(chartData.length === 0){
      return res.status(404).json({
        status : false , 
        message : "no completed lessons"
      })
    }
    res.status(200).json({
      status : true , 
      data : chartData
    })
  }
  catch(err){
    next(err)
  }
}

module.exports = {
  getLessonStatistics,
  getUserStatistics,
  getStreaksStatistics,
  getChartData
}