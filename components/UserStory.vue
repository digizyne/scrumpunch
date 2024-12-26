<template>
    <div class="user-story">
        <textarea ref="textarea" v-model="input"></textarea>
        <div class="flex">
            <button class="text red" @click="deleteStory">Delete</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useTextareaAutosize } from "@vueuse/core";

const props = defineProps<{
    userStory: UserStory;
}>();

const emit = defineEmits(["story-deleted"]);

const { textarea, input } = useTextareaAutosize();

onMounted(() => {
    input.value = props.userStory.description;
});

const deleteStory = async () => {
    try {
        await $fetch(`/api/user-story/${props.userStory.id}`, {
            method: "DELETE",
        });
        emit("story-deleted");
    }
    catch (err: any) {
        console.log(err.response);
    }
};
</script>

<style scoped lang="scss">
.user-story {
    background-color: #333;
    color: #ccc;
    padding: 1rem;
    margin: 1rem;
    border-radius: 0.5rem;

    textarea {
        width: 100%;
        resize: none;
        -ms-overflow-style: none;
        scrollbar-width: none;
        padding: 0.5rem 1rem;
        line-height: 1.5;
        border: none;
        outline: none;
        border-radius: 0.5rem;
        background-color: #444;
        color: #ccc;

        &::-webkit-scrollbar {
            display: none;
        }
    }

    .flex {
        display: flex;
        gap: 1rem;
        justify-content: flex-end;
        margin-top: 1rem;
    }
}

.red {
    color: rgb(243, 76, 76);
}
</style>