<template>
    <div :class="['container', { expanded: expandedFeature }]" :style="{ left }">
        <Feature :feature="newFeature" new-feature @feature-updated="updateFeature" />

        <hr :class="{ blurred: expandedFeature }" />

        <Feature v-for="feature in props.features" :key="feature.id" blurred :feature="feature"
            @feature-deleted="emit('refresh')">
        </Feature>
    </div>
</template>

<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid';

const expandedFeature = useExpandedFeature();

const props = defineProps<{
    features: Feature[];
}>();

const emit = defineEmits(["refresh"]);

const newFeature = ref<Feature>({
    id: uuidv4(),
    description: "",
});

const left = computed<string>(() => {
    return expandedFeature.value ? "1rem" : "calc(50% - 384px)";
})

const updateFeature = () => {
    newFeature.value = {
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
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
    }

    hr {
        border: none;
        outline: none;
        border-top: 1px solid #575757;
        width: 99%;
        margin: 0 auto;

        &.blurred {
            opacity: 0.05;
            filter: blur(5px);
        }
    }
}
</style>