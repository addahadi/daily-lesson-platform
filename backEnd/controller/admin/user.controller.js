
const sql = require("../../db")
const clerk = require("../../clerkClient")

async function getUsers(req , res , next){
   const page = parseInt(req.query.page) || 1;
   const limit = 5;
   const offset = (page - 1) * limit;

    
    try{
      const [{ count }] = await sql`
      SELECT COUNT(*)::int as count FROM users
      WHERE is_deleted = false
    `;

      const users = await sql`
      SELECT * FROM users
      WHERE is_deleted = false
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;
        res.status(200).json({
            status: true , 
            data : response,
            final : count === users.length
        })
    }
    catch(err){
        next(err)
    }
}



async function UpdateUser(req, res, next) {
  try {
    const { userId } = req.params;
    const { role, status } = req.body;

    const response = await sql`
        UPDATE users
        SET role = ${role}, status = ${status}
        WHERE clerk_id = ${userId}
        RETURNING *;
      `;

    res.status(200).json({
      status: true,
      data: response[0],
    });
  } catch (err) {
    next(err);
  }
}

async function DeleteUser(req , res , next){
  const { userId } = req.params;
  try {
    await clerk.users.deleteUser(userId);
    
    await sql`DELETE FROM users WHERE clerk_id = ${userId}`;
    return res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (err) {
    next()
  }
}


module.exports = { getUsers, UpdateUser , DeleteUser };
  