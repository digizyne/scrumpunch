import { pool } from "~/database";
import { z } from "zod";

const paramsSchema = z.object({
    id: z.string().uuid(),
});

const bodySchema = z.object({
    description: z.string().min(1).max(255),
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

    const { description } = await readValidatedBody(event, (body) => bodySchema.parse(body));
    await pool.query('UPDATE user_story SET description=$1 WHERE id=$2', [description, id]);

    setResponseStatus(event, 200);
    return {
        message: `User Story ${id} updated`,
    }
})
