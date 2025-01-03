import { pool } from "~/database";
import { z } from "zod";

const paramsSchema = z.object({
    id: z.string().uuid(),
});

export default defineEventHandler(async (event) => {
    const { id } = await getValidatedRouterParams(event, paramsSchema.parse);
    const res = await pool.query('SELECT EXISTS(SELECT 1 FROM user_story WHERE id=$1)', [id]);
    if (!res.rows[0].exists) {
        throw createError({
            statusCode: 404,
            statusMessage: 'User Story not found',
        })
    }

    await pool.query('DELETE FROM user_story WHERE id=$1', [id]);

    setResponseStatus(event, 200);
    return {
        message: `User Story ${id} deleted`,
    }
})
