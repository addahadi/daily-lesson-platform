const sql = require("../db");



function deleteNote(req , res) {

}

async function addNote(req , res){
    try {
        const {title , content , lessonId , userId} = req.body
        console.log(content , lessonId , title , userId)
        if(!content || !lessonId || !userId){
            return res.status(400)
        .json({ status: false, message: "Missing required fields" });
        }
        await sql`INSERT INTO notes (title, content, lesson_slug, user_id)
            VALUES (${title}, ${content}, ${lessonId},  ${userId})
            ON CONFLICT (user_id, lesson_slug)
            DO UPDATE SET
            title = EXCLUDED.title,
            content = EXCLUDED.content,
            updated_at = now();`;

        res.status(200).json({
            status : true,
            message : "succesfull inserting"
        })
        
    }
    catch(err){
        console.log(err)
        res.status(500).json({message : err.message})
    }
}


async function getLessonNote(req, res) {
    try {
        const {lessonId , userId} = req.params
        const result =
          await sql`SELECT content , title FROM notes
            WHERE user_id = ${userId} AND lesson_slug= ${lessonId}`;

        if(result.length == 0){
            return res.status(200).json({
              content: '',
              title: '',
            });  
        }
        res.status(200).json({
            status : true,
            data : result
        })
                
    }
    catch(err){
        console.log(err)
        res.status(500).json({message : err.message})
    }
}



async function getAllNotes(req , res){
    try{
        const {userId} = req.params
        const notes = await sql`
        SELECT n.content, n.title AS note_title, l.title AS lesson_title , n.created_at , l.topic_id , l.slug as lesson_slug ,
        (SELECT slug as course_slug FROM courses WHERE courses.id = m.course_id)
        FROM notes n
        JOIN lessons l ON n.lesson_slug = l.slug
        JOIN modules m ON m.id = l.topic_id
        WHERE n.user_id = ${userId}
        `;
        if(notes.length == 0){
            return res.status(404).json({
                status : true , 
                message : "no data"
            })
        }

        res.status(200).json({
            status : true ,
            data : notes
        })        
    }
    catch(err){
        console.log(err)
        res.status(500).json({
            message : err.message
        })
    }
}


module.exports = {deleteNote , addNote , getLessonNote , getAllNotes}