import { pool } from "~/database";
import { z } from "zod";

const paramsSchema = z.object({
    id: z.string().uuid(),
});

export default defineEventHandler(async (event) => {
    const { id } = await getValidatedRouterParams(event, paramsSchema.parse);
    const res = await pool.query('SELECT EXISTS(SELECT 1 FROM feature WHERE id=$1)', [id]);
    if (!res.rows[0].exists) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Feature not found',
        })
    }

    await pool.query('DELETE FROM feature WHERE id=$1', [id]);

    setResponseStatus(event, 200);
    return {
        message: `Feature ${id} deleted`,
    }
})
