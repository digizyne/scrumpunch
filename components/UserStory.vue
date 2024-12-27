<template>
    <div class="user-story">
        <textarea ref="textarea" v-model="input"
            :placeholder="newStory ? 'I want to...' : `User story will be deleted if left blank in ${emptyCountdown}`"></textarea>
        <div class="flex">
            <button v-if="newStory" class="green" @click="updateStory">
                <Icon name="ph:plus-bold" />
                Create
            </button>

            <button v-else :class="['red', { confirming }]" @click="handleDelete">
                <div class="flex-small" v-if="!confirming">
                    <Icon name="ph:trash-duotone" />
                    Delete
                </div>
                <div v-else class="flex-small">
                    <div>Confirm Delete</div>
                    <div>({{ countdown }})</div>
                </div>
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useTextareaAutosize, watchDebounced } from "@vueuse/core";

const props = defineProps<{
    story: UserStory;
    newStory?: boolean;
}>();

const emit = defineEmits(["story-deleted", "story-updated"]);

const { textarea, input } = useTextareaAutosize();

onMounted(() => {
    input.value = props.story.description;
});

watchDebounced(input, async () => {
    if (!input.value || input.value === '') {
        if (props.newStory) {
            return;
        }

        const interval = setInterval(async () => {
            emptyCountdown.value--;
            if (emptyCountdown.value === 0) {
                await deleteStory();
                emptyCountdown.value = 15;
                clearInterval(interval);
            }
        }, 1000);
    }

    else if (!props.newStory) {
        await updateStory();
    }
}, {
    debounce: 2500,
    maxWait: 5000,
})

const confirming = ref<boolean>(false);
const countdown = ref<number>(5);
const emptyCountdown = ref<number>(15);

const handleDelete = async () => {
    if (confirming.value) {
        await deleteStory();
        return;
    }

    confirming.value = true;
    const interval = setInterval(() => {
        countdown.value--;
        if (countdown.value === 0) {
            confirming.value = false;
            countdown.value = 5;
            clearInterval(interval);
        }
    }, 1000);
};

const updateStory = async () => {
    if (!input.value || input.value === '') return;

    try {
        await $fetch(`/api/user-story/${props.story.id}`, {
            method: "PUT",
            body: JSON.stringify({
                description: input.value,
            }),
        });
        emit("story-updated");
    }
    catch (err: any) {
        console.log(err.response);
    }
};

const deleteStory = async () => {
    try {
        await $fetch(`/api/user-story/${props.story.id}`, {
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

        .flex-small {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
        }
    }
}

.red {
    background-color: #ffa1a2;
    color: #151515;
    margin-top: 1rem;
    // transition: all 0.15s linear;
}

.green {
    background-color: #a1ffa1;
    color: #151515;
    margin-top: 1rem;
    // transition: all 0.15s linear;
}

.confirming {
    background-color: #300708;
    color: #f0f2f4;
}
</style>