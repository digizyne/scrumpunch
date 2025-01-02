export {
    UserStory,
    Feature,
}

declare global {
    interface UserStory {
        id: string;
        description: string;
        created_at?: Date;
        updated_at?: Date;
        archived_at?: Date;
        features?: Feature[];
    }

    interface Feature {
        id: string;
        description: string;
        user_story_id?: string;
        created_at?: Date;
        updated_at?: Date;
        archived_at?: Date;
    }
}