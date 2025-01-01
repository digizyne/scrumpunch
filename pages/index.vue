<template>
    <div class="index">
        <div v-if="status === 'pending'">Loading user stories...</div>
        <div v-else-if="error">{{ error }}</div>
        <UserStories v-else-if="userStories && userStories.length > 0" :user-stories="userStories" />
        <div v-else>No user stories found.</div>
    </div>
</template>

<script setup lang="ts">
const { data: userStories, error, status, refresh } = await useLazyFetch<UserStory[]>("/api/user-story?include_features=true");
</script>

<style lang="scss" scoped>
.index {
    position: relative;
}
</style>