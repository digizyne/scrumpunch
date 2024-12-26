import { pool } from "~/database";

export default defineEventHandler(async () => {
    const res = await pool.query('SELECT * FROM user_story');
    return res.rows as UserStory[];
})
