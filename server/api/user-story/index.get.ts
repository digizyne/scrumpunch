import { pool } from "~/database";

export default defineEventHandler(async () => {
    const res = await pool.query('SELECT * FROM user_story ORDER BY updated_at DESC');
    return res.rows as UserStory[];
})
