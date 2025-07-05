const sql = require("../db")


async function addXp(client,source , userId , xp){
  await client`
    INSERT INTO xp_logs (user_id, source,  xp_earned)
    VALUES (${userId}, ${source},  ${xp})
  `;

  await client`
    UPDATE users
    SET xp = xp + ${xp}
    WHERE clerk_id = ${userId}
  `;
}



async function checkAchievements(client , enrollment_id, user_id) {
  const lesson_user_quizz = await client`
    SELECT 
      (
        SELECT COUNT(*) FROM lesson_progress 
        WHERE enrollment_id = ${enrollment_id} AND completed = TRUE
      ) AS progressed_lessons,

      (
        SELECT streak_count FROM users 
        WHERE clerk_id = ${user_id}
      ) AS streak_count,

      (
        SELECT level FROM users 
        WHERE clerk_id = ${user_id}
      ) AS level,

      (
        SELECT COUNT(*) FROM quiz_answers 
        WHERE user_id = ${user_id} AND is_correct = TRUE
      ) AS valid_answers
  `;

  const result = lesson_user_quizz[0];
  const arrayFormat = Object.entries(result);

  for (let i = 0; i < arrayFormat.length; i++) {
    const key = arrayFormat[i][0];
    const value = Number(arrayFormat[i][1]);

    switch (key) {
      case "progressed_lessons":
        if (value >= 1) {
          await tryUnlockAchievement(client ,user_id, "first_lesson");
        }
        if (value >= 10) {
          await tryUnlockAchievement(client , user_id, "ten_lessons");
        }
        break;

      case "streak_count":
        if (value >= 3) {
          await tryUnlockAchievement(client , user_id, "three_day_streak");
        }
        break;

      case "level":
        if (value >= 5) {
          await tryUnlockAchievement(client ,user_id, "level_5");
        }
        break;

      case "valid_answers":
        if (value >= 5) {
          await tryUnlockAchievement(client , user_id, "five_quizzes");
        }
        break;
    }
  }
}

async function tryUnlockAchievement(client , user_id , code) {
  const achievement = await client`
    SELECT * FROM achievements WHERE code = ${code}
  `.then((r) => r[0]);

  if (!achievement) return;

  const already = await client`
    SELECT 1 FROM user_achievements 
    WHERE user_id = ${user_id} AND achievement_id = ${achievement.id}
  `;

  if (already.length > 0) return;

  await client`
    INSERT INTO user_achievements (user_id, achievement_id)
    VALUES (${user_id}, ${achievement.id})
  `;

  if (achievement.xp_reward > 0) {
    await client`
      UPDATE users
      SET xp = xp + ${achievement.xp_reward}
      WHERE clerk_id = ${user_id}
    `;
  }

}


async function getXpLogs(req , res){
  const { userId } = req.params;

  try {
    const xpLogs = await sql`
    SELECT 
      to_char(date_trunc('day', created_at), 'YYYY-MM-DD') AS day,
      SUM(xp_earned)::int AS xp_per_day
    FROM xp_logs
    WHERE user_id = ${userId}
    GROUP BY day
    ORDER BY day;
  `;
  

    res.status(200).json({
      status : true , 
      data : xpLogs
    });
  } catch (error) {
    console.error("Error fetching XP logs:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}





module.exports = {addXp , checkAchievements , getXpLogs}