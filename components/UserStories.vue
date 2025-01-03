<template>
    <div>
        <h1 :class="{ blurred: expandedStory }">As a user</h1>
        <div class="container" :style="{ left }">
            <UserStory :story="newStory" new-story @story-updated="updateStory" />
            <hr :class="{ blurred: expandedStory }" />
            <UserStory v-for="story in props.userStories" :key="story.id" :story="story"
                @story-deleted="emit('refresh')">
            </UserStory>
        </div>
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
h1 {
    position: relative;
    max-width: max-content;
    margin: 2rem auto 2rem auto;
    transition: all 0.35s ease;

    &.blurred {
        opacity: 0.05;
        filter: blur(5px);
    }

    &::before,
    &::after {
        content: "";
        position: absolute;
        top: 15px;
        left: -175px;
        width: 150px;
        height: 10px;
        border-top: 1px solid #a288eb;
        border-bottom: 1px solid #a288eb;
    }

    &::after {
        left: auto;
        right: -175px;
    }
}

.container {
    // width: 768px;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    // padding-bottom: 2rem;
    transition: all 0.35s ease;
    overflow-y: auto;
    height: 85vh;
    scrollbar-width: none;
    // position: relative;
    // border: 3px solid blue;
    // position: absolute;

    // &::after {
    //     content: "";
    //     position: absolute;
    //     bottom: 0;
    //     left: 0;
    //     width: 35vw;
    //     height: 100px;
    //     background-color: rgba(0, 0, 0, 0.5);
    //     filter: blur(2px);
    //     backdrop-filter: blur(10px);
    // }

    hr {
        border: none;
        outline: none;
        border-top: 1px solid #333;
        width: 99%;
        margin: 0 auto;

        &.blurred {
            opacity: 0.05;
            filter: blur(5px);
        }
    }
}
</style>