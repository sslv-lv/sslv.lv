<template>
    <div v-if="isVisible" class="chat-popup">
        <div class="chat-header">
        </div>
        <div class="chat-body" data-mdb-perfect-scrollbar="true">
            <div v-for="(message, index) in chatMessages" :key="index" class="chat-message">
                {{ message }}
            </div>
        </div>
        <div class="chat-footer">
            <div class="input-group mb-0">
                <input v-model="newMessage" type="text" class="form-control" placeholder="Type message"
                    aria-label="Type message" aria-describedby="button-addon2" />
                <button @click="sendMessage" class="btn btn-warning" type="button" id="button-addon2"
                    style="padding-top: .55rem;">
                    Send
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, defineProps, watch, onMounted, onUnmounted, defineEmits } from 'vue';

const props = defineProps({
    isVisible: Boolean
});

const emit = defineEmits();

const isVisible = ref(props.isVisible);
const newMessage = ref('');
const chatMessages = ref<string[]>([]);

const closeChat = () => {
    isVisible.value = false;
};

const sendMessage = () => {
    if (newMessage.value.trim() !== '') {
        chatMessages.value.push(newMessage.value);
        newMessage.value = '';
        emit('message', chatMessages.value);
    }
};

watch(() => props.isVisible, (newValue) => {
    isVisible.value = newValue;
});

onMounted(() => {
    // Additional setup code if needed
});

onUnmounted(() => {
    // Cleanup code if needed
});
</script>

<style scoped>
/* Styles for the chat popup window */
.chat-popup {
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 320px;
    height: 500px;
    background-color: white;
    border: 1px solid #ccc;
    border-radius: 10px;
    box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
}

.chat-header {
    background-color: #ffa900;
    color: white;
    padding: 15px;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.chat-icons {
    display: flex;
    align-items: center;
}

.chat-body {
    padding: 15px;
    overflow-y: auto;
}

.chat-footer {
    padding: 15px;
    border-top: 1px solid #ccc;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>

<script setup lang="ts">
import { ref, defineProps, watch } from 'vue';

const props = defineProps({
    isVisible: Boolean
});

const isVisible = ref(props.isVisible);

const closeChat = () => {
    isVisible.value = false;
};

// Watch for changes in the isVisible prop
watch(() => props.isVisible, (newValue) => {
    isVisible.value = newValue;
});
</script>
