<template>
    <div v-if="status === 'pending'">Loading user stories...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else-if="userStories?.length === 0">No user stories found.</div>
    <div v-else class="container">
        <h1>As a user</h1>

        <UserStory :story="newStory" new-story @story-updated="updateStory" />

        <UserStory v-for="story in userStories" :key="story.id" :story="story" @story-deleted="refresh">
        </UserStory>
    </div>
</template>

<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid';

const { data: userStories, error, status, refresh } = await useLazyFetch<UserStory[]>("/api/user-story");

const newStory = ref<UserStory>({
    id: uuidv4(),
    description: "",
});

const updateStory = async () => {
    newStory.value = {
        id: uuidv4(),
        description: "",
    };
    await refresh();
}
</script>

<style lang="scss">
.container {
    max-width: 768px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 2rem 0;

    h1 {
        position: relative;
        max-width: max-content;
        margin: auto;

        &::before,
        &::after {
            content: "";
            position: absolute;
            top: 15px;
            left: -225px;
            width: 200px;
            height: 10px;
            border-top: 1px solid #f0f2f4;
            border-bottom: 1px solid #f0f2f4;
        }

        &::after {
            left: auto;
            right: -225px;
        }
    }
}
</style>