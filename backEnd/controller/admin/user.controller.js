
const sql = require("../../db")
const clerk = require("../../clerkClient")

async function getUsers(req , res , next){
   const page = parseInt(req.query.page) || 1;
   const limit = 1;
   const offset = (page - 1) * limit;
    
    try{
            
      const users = await sql`
      SELECT * FROM users
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET ${offset}
      `;

      if(users.length === 0) {
        return res.status(404).json({
          status: false,
          message: "No users found"
        });
      }

      const [{ count }] = await sql`
        SELECT COUNT(*)::int as count FROM users
      `;
      const totalPages = Math.ceil(count / limit);
      const isFinalPage = page >= totalPages;

      res.status(200).json({
          status: true , 
          data : users,
          final : !isFinalPage
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
    if(response[0].length === 0){
      return res.status(404).json({
        status: false,
        message: "failed to update user"
      });
    }

    const user = await clerk.users.getUser(userId);
    await clerk.users.updateUser(userId, {
      publicMetadata: {
        ...user.publicMetadata,
        role,
        status,
      },
    });


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
  