export {
    UserStory
};

declare global {
    interface UserStory {
        id: string;
        description: string;
        created_at?: Date;
        updated_at?: Date;
        archived_at?: Date;
    }
}