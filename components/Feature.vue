<template>
    <div :class="['feature', { blurred }]">
        <textarea ref="textarea" v-model="input"
            :placeholder="newFeature ? 'I want to...' : `Feature will be deleted if left blank in ${emptyCountdown}`"></textarea>
        <div class="flex">
            <button v-if="newFeature" class="green" @click="updateFeature">
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
                <button :class="['expand']" @click="expandFeature">
                    {{ expandedFeature ? 'Hide' : 'Show' }} Tasks
                    <Icon :name="`ph:arrow-fat-${expandedFeature ? 'left' : 'right'}-duotone`" />
                </button>
            </div>
        </div>
        <!-- <div v-if="story.features?.length && showFeatures" class="features">
            <button v-for="feature in story.features" :key="feature.id" class="feature">
                <div>{{ feature.description }}</div>
                <Icon name="ph:arrow-fat-right-duotone" />
            </button>
        </div> -->
    </div>
</template>

<script setup lang="ts">
import { useTextareaAutosize, watchDebounced } from "@vueuse/core";

const expandedFeature = useExpandedFeature();

const props = defineProps<{
    feature: Feature;
    newFeature?: boolean;
    // blurred?: boolean;
}>();

const emit = defineEmits(["feature-deleted", "feature-updated"]);

const { textarea, input } = useTextareaAutosize();
const initialRender = ref<boolean>(true);

onMounted(() => {
    input.value = props.feature.description;
});

const expandFeature = () => {
    if (expandedFeature.value) {
        expandedFeature.value = null;
    }
    else {
        expandedFeature.value = props.feature;
    }
};

const blurred = computed<boolean>(() => {
    return expandedFeature.value !== null && expandedFeature.value.id !== props.feature.id;
});

watchDebounced(input, async () => {
    if (initialRender.value) {
        initialRender.value = false;
        return;
    }
    if (!input.value || input.value === '') {
        if (props.newFeature) {
            return;
        }

        const interval = setInterval(async () => {
            emptyCountdown.value--;
            if (emptyCountdown.value === 0) {
                await deleteFeature();
                emptyCountdown.value = 15;
                clearInterval(interval);
            }
        }, 1000);
    }

    else if (!props.newFeature) {
        await updateFeature();
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
        await deleteFeature();
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

const updateFeature = async () => {
    if (!input.value || input.value === '') return;

    try {
        await $fetch(`/api/feature/${props.feature.id}`, {
            method: "PUT",
            body: JSON.stringify({
                description: input.value,
            }),
        });
        emit("feature-updated");
    }
    catch (err: any) {
        console.log(err.response);
    }
};

const deleteFeature = async () => {
    try {
        await $fetch(`/api/feature/${props.feature.id}`, {
            method: "DELETE",
        });
        emit("feature-deleted");
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
    transition: all 0.35s ease;

    &.blurred {
        opacity: 0.05;
        filter: blur(5px);
    }

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