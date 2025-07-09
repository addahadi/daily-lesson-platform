
const sql = require("../../db")
const clerk = require("../../clerkClient")

async function getUsers(req , res , next){
    try{
        const response = await sql`
        SELECT * FROM users
        ` 

        res.status(200).json({
            status: true , 
            data : response
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
    console.log("very good")
    return res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (err) {
    next()
  }
}


module.exports = { getUsers, UpdateUser , DeleteUser };
  