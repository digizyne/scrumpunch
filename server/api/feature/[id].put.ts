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
    const res = await pool.query('SELECT EXISTS(SELECT 1 FROM feature WHERE id=$1)', [id]);
    const { description } = await readValidatedBody(event, (body) => bodySchema.parse(body));

    if (!res.rows[0].exists) {
        await pool.query('INSERT INTO feature (id, description) VALUES ($1, $2)', [id, description]);
    }

    else await pool.query('UPDATE feature SET description=$1, updated_at=NOW() WHERE id=$2', [description, id]);

    setResponseStatus(event, 200);
    return {
        message: `Feature ${id} updated`,
    }
})
