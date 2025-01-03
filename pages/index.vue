<template>
    <div class="index">
        <div v-if="status === 'pending'">Loading user stories...</div>
        <div v-else-if="error">{{ error }}</div>
        <div v-else-if="userStories && userStories.length > 0" class="grid" :style="{ left }" ref="grid">
            <UserStories :user-stories="userStories" @refresh="refresh" />
            <!-- <Transition> -->
            <Features v-if="expandedStory" :features="expandedStoryFeatures" />
            <!-- </Transition> -->
            <!-- <UserStories :user-stories="userStories" /> -->
        </div>
        <div v-else>No user stories found.</div>
    </div>
</template>

<script setup lang="ts">
import { useElementSize } from "@vueuse/core"

const expandedStory = useExpandedStory();
const expandedStoryFeatures = useExpandedStoryFeatures();

const { data: userStories, error, status, refresh } = await useLazyFetch<UserStory[]>("/api/user-story?include_features=true");

// const gridTemplateColumns = computed<string>(() => {
//     return expandedStory.value ? "1fr 1fr 0" : "768px 0 0";
// });
// const width = computed<string>(() => {
//     return expandedStory.value ? "100%" : "768px";
// });

const grid = ref<HTMLDivElement | null>(null);
const { width } = useElementSize(grid);

const left = computed<string>(() => {
    return expandedStory.value ? `calc(50vw - ${width.value / 3}px)` : `calc(50vw - ${width.value / 6}px)`;
});
</script>

<style lang="scss" scoped>
.index {
    position: relative;
    padding: 0 1rem;
    overflow: hidden;
    // overflow: hidden;
    // background-color: blue;
    width: 100vw;
    height: 100vh;

    .grid {
        display: grid;
        justify-content: center;
        align-items: flex-start;
        grid-template-columns: repeat(3, 1fr);
        // background-color: purple;
        // border: 3px solid gold;
        width: 100%;
        position: absolute;
        // left: calc(50vw - 384px);

        // animation: slide-left 1s ease;
        transition: all 0.35s ease;
        // margin: auto;
    }
}

// @keyframes slide-left {
//     from {
//         grid-template-columns: 768px 0 0;
//     }

//     to {
//         grid-template-columns: 1fr 1fr 0;
//     }
// }

.v-enter-active,
.v-leave-active {
    transition: opacity 0.35s ease 0.35s;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}
</style>