import { pool } from "~/database";

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id');

    const res = await pool.query('SELECT id FROM user_story WHERE id = $1', [id]);
    return res.rows as UserStory[];
})
