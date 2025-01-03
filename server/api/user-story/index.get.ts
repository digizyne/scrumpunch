import { pool } from "~/database";
import { z } from "zod";

const querySchema = z.object({
    include_features: z.enum(["true", "false"]).optional(),
    include_tasks: z.enum(["true", "false"]).optional(),
});

export default defineEventHandler(async (event) => {
    try {
        const res = await pool.query('SELECT * FROM user_story ORDER BY updated_at DESC');
        let { rows: userStories } = res as { rows: UserStory[] };

        const { include_features, include_tasks } = await getValidatedQuery(event, querySchema.parse);

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

        if (include_tasks !== undefined && include_tasks === "true" && include_features !== undefined && include_features === "true") {
            userStories = await Promise.all(userStories.map(async (story) => {
                story.features = await Promise.all(story!.features!.map(async (feature) => {
                    const taskRes = await pool.query('SELECT * FROM task WHERE feature_id=$1', [feature.id]);
                    const { rows: tasks } = taskRes;
                    return {
                        ...feature,
                        tasks,
                    }
                }));
                return story;
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
