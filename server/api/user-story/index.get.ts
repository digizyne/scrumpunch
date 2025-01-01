import { pool } from "~/database";
import { z } from "zod";

const querySchema = z.object({
    include_features: z.enum(["true", "false"]).optional(),
});

export default defineEventHandler(async (event) => {
    try {
        const res = await pool.query('SELECT * FROM user_story ORDER BY updated_at DESC');
        let { rows: userStories } = res as { rows: UserStory[] };

        const { include_features } = await getValidatedQuery(event, querySchema.parse);
        if (include_features !== undefined && include_features === "true") {
            userStories = await Promise.all(userStories.map(async (story) => {
                const featureRes = await pool.query('SELECT * FROM feature WHERE user_story_id=$1', [story.id]);
                const { rows: features } = featureRes;
                return {
                    ...story,
                    features,
                }
            }));
        }
        return userStories;
    }
    catch (err) {
        console.log(err);
        throw createError({
            statusCode: 500,
            statusMessage: 'Unable to fetch user stories',
        })
    }
})
