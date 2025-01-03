export {
    UserStory,
    Feature,
    Task
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
        tasks?: Task[];
        created_at?: Date;
        updated_at?: Date;
        archived_at?: Date;
    }

    interface Task {
        id: string;
        description: string;
        feature_id?: string;
        created_at?: Date;
        updated_at?: Date;
        archived_at?: Date;
    }
}