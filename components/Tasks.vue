<template>
    <div :class="['container', { expanded: expandedFeature }]">
        <Task :task="newTask" new-task @task-updated="updateTask" />

        <hr />

        <Task v-for="task in props.tasks" :key="task.id" :task="task" @task-deleted="emit('refresh')">
        </Task>
    </div>
</template>

<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid';

const expandedFeature = useExpandedFeature();

const props = defineProps<{
    tasks: Task[];
}>();

const emit = defineEmits(["refresh"]);

const newTask = ref<Feature>({
    id: uuidv4(),
    description: "",
});

const updateTask = () => {
    newTask.value = {
        id: uuidv4(),
        description: "",
    };
    emit('refresh');
}
</script>

<style lang="scss" scoped>
.container {
    // width: 768px;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 2rem;
    margin: 1rem 0;
    border-radius: 0.5rem;
    transition: all 0.35s ease;
    // position: absolute;
    background-color: #333;
    height: calc(100vh - 2rem);
    overflow-y: auto;
    scrollbar-width: none;

    &.expanded {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
    }

    hr {
        border: none;
        outline: none;
        border-top: 1px solid #575757;
        width: 99%;
        margin: 0 auto;
    }
}
</style>