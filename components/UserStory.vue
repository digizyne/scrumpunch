<template>
    <div class="user-story">
        <textarea v-if="editing" name="" id="" v-model="editableDescription"></textarea>
            <p v-if="!editing">{{ userStory.description }}</p>
        <div class="flex">
            <button class="text" @click="toggleEditing">{{ editing ? 'Cancel' : 'Edit' }}</button>
            <button class="text" v-if="editing">Save</button>
            <button class="text red" v-else>Delete</button>
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    userStory: UserStory;
}>();

const editing = ref<boolean>(true);
const editableDescription = ref<string>("");
onMounted(() => {
    editableDescription.value = props.userStory.description;
});

const toggleEditing = () => {
    if (editing.value) {
        editableDescription.value = props.userStory.description;
    }
    editing.value = !editing.value;
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
        padding: 0.5rem;
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