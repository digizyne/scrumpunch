<template>
    <div class="index">
        <div v-if="status === 'pending'">Loading user stories...</div>
        <div v-else-if="error">{{ error }}</div>
        <div v-else-if="userStories && userStories.length > 0" class="grid">
            <UserStories :user-stories="userStories" />
            <Features v-if="expandedStory" :features="expandedStoryFeatures" />
            <!-- <UserStories :user-stories="userStories" /> -->
        </div>
        <div v-else>No user stories found.</div>
    </div>
</template>

<script setup lang="ts">
const expandedStory = useExpandedStory();
const expandedStoryFeatures = useExpandedStoryFeatures();

const { data: userStories, error, status, refresh } = await useLazyFetch<UserStory[]>("/api/user-story?include_features=true");
</script>

<style lang="scss" scoped>
.index {
    position: relative;
    padding: 0 1rem;

    .grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1rem;
    }
}
</style>