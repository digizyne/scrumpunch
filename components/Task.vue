<template>
    <div :class="['task']">
        <textarea ref="textarea" v-model="input"
            :placeholder="newTask ? 'New task...' : `Task will be deleted if left blank in ${emptyCountdown}`"></textarea>
        <div class="flex">
            <button v-if="newTask" class="green" @click="updateTask">
                <Icon name="ph:plus-bold" />
                Create
            </button>

            <div v-else class="actions">
                <button :class="['red', { confirming }]" @click="handleDelete">
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
    </div>
</template>

<script setup lang="ts">
import { useTextareaAutosize, watchDebounced } from "@vueuse/core";

const props = defineProps<{
    task: Task;
    newTask?: boolean;
}>();

const emit = defineEmits(["task-deleted", "task-updated"]);

const { textarea, input } = useTextareaAutosize();
const initialRender = ref<boolean>(true);

onMounted(() => {
    input.value = props.task.description;
});

watchDebounced(input, async () => {
    if (initialRender.value) {
        initialRender.value = false;
        return;
    }
    if (!input.value || input.value === '') {
        if (props.newTask) {
            return;
        }

        const interval = setInterval(async () => {
            emptyCountdown.value--;
            if (emptyCountdown.value === 0) {
                await deleteTask();
                emptyCountdown.value = 15;
                clearInterval(interval);
            }
        }, 1000);
    }

    else if (!props.newTask) {
        await updateTask();
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
        await deleteTask();
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

const updateTask = async () => {
    if (!input.value || input.value === '') return;

    try {
        await $fetch(`/api/task/${props.task.id}`, {
            method: "PUT",
            body: JSON.stringify({
                description: input.value,
            }),
        });
        emit("task-updated");
    }
    catch (err: any) {
        console.log(err.response);
    }
};

const deleteTask = async () => {
    try {
        await $fetch(`/api/task/${props.task.id}`, {
            method: "DELETE",
        });
        emit("task-deleted");
    }
    catch (err: any) {
        console.log(err.response);
    }
};
</script>

<style scoped lang="scss">
.task {
    background-color: #575757;
    color: #ccc;
    padding: 1rem;
    border-radius: 0.5rem;
    transition: all 0.35s ease;
    border-left: 10px solid #f4f995;

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
        background-color: #777;
        color: #f0f2f4;

        &::-webkit-scrollbar {
            display: none;
        }

        &::placeholder {
            color: #ccc;
        }
    }

    .flex {
        display: flex;
        gap: 1rem;
        justify-content: flex-end;

        .actions {
            display: flex;
            gap: 1rem;
            margin-top: 1rem;
            width: 100%;
            justify-content: space-between;

            .expand {
                // flex: 1;
                background-color: #151515;
                color: #ccc;
            }

            .flex-small {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 0.5rem;
            }
        }
    }

    .features {
        // margin: auto;
        margin-top: 1rem;
        display: block flex;
        flex-direction: column;
        gap: 1rem;
        width: 500px;

        .feature {
            background-color: #151515;
            // padding: 0.5rem 1rem;
            // border-radius: 0.5rem;
            color: #ccc;
            border-left: 5px solid #a1ffa1;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 1rem;
        }
    }
}

.red {
    background-color: #ffa1a2;
    color: #151515;
    // margin-top: 1rem;
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