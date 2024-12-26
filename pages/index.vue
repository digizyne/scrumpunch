<template>
    <div v-if="status === 'pending'">Loading user stories...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else-if="userStories?.length === 0">No user stories found.</div>
    <div v-else class="container">
        <UserStory v-for="story in userStories" :key="story.id" :user-story="story" @story-deleted="refresh"></UserStory>
    </div>
</template>

<script setup lang="ts">
const { data: userStories, error, status, refresh } = await useLazyFetch<UserStory[]>("/api/user-story");
</script>

<style lang="scss">
.container {
    max-width: 768px;
    margin: 0 auto;
}
</style>