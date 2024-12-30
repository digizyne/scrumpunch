import { pool } from "~/database";

export default defineEventHandler(async () => {
    try {
        const res = await pool.query('SELECT * FROM user_story ORDER BY updated_at DESC');
        return res.rows as UserStory[];
    }
    catch (err) {
        console.log(err);
        throw createError({
            statusCode: 500,
            statusMessage: 'Unable to fetch user stories',
        })
    }
})
