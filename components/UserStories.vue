<template>
    <div class="container" :style="{ left }">
        <h1>As a user</h1>

        <UserStory :story="newStory" new-story @story-updated="updateStory" />

        <hr />

        <UserStory v-for="story in props.userStories" :key="story.id" blurred :story="story"
            @story-deleted="emit('refresh')">
        </UserStory>
    </div>
</template>

<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid';

const expandedStory = useExpandedStory();

const props = defineProps<{
    userStories: UserStory[];
}>();

const emit = defineEmits(["refresh"]);

const newStory = ref<UserStory>({
    id: uuidv4(),
    description: "",
});

const left = computed<string>(() => {
    return expandedStory.value ? "1rem" : "calc(50% - 384px)";
})

const updateStory = () => {
    newStory.value = {
        id: uuidv4(),
        description: "",
    };
    emit('refresh');
}
</script>

<style lang="scss" scoped>
.container {
    width: 768px;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 2rem 0;
    transition: all 0.35s ease;
    position: absolute;

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
            border-top: 1px solid #a1ffa1;
            border-bottom: 1px solid #a1ffa1;
        }

        &::after {
            left: auto;
            right: -225px;
        }
    }

    hr {
        border: none;
        outline: none;
        border-top: 1px solid #333;
        width: 99%;
        margin: 0 auto;
    }
}
</style>