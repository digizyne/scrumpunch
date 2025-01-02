<template>
    <div class="container" :style="{ left }">
        <Feature :feature="newFeature" new-feature @feature-updated="updateFeature" />

        <hr />

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
    margin-top: 1rem;
    border-radius: 0.5rem;
    transition: all 0.35s ease;
    // position: absolute;
    background-color: #333;

    hr {
        border: none;
        outline: none;
        border-top: 1px solid #151515;
        width: 99%;
        margin: 0 auto;
    }
}
</style>