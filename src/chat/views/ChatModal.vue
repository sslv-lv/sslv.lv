<template>
    <div class="chat-container">
        <div class="card chat-card">
            <div class="card-header d-flex justify-content-between align-items-center p-3">
                <h5 class="mb-0">Ziņas</h5>
                <div class="d-flex flex-row align-items-center">
                    <span class="badge bg-info me-3">{{ messages.length }}</span>
                    <i class="fas fa-minus me-3 text-white fa-xs"></i>
                    <i class="fas fa-comments me-3 text-white fa-xs"></i>
                    <i class="fas fa-times text-white fa-xs"></i>
                </div>
            </div>
            <div class="card-body chat-body" data-mdb-perfect-scrollbar="true">
                <!-- Chat messages display -->
                <div v-for="(message, index) in messages" :key="index" class="chat-message">
                    <div class="d-flex justify-content-between">
                        <p class="small mb-1" v-if="message.sender === 'You'">Tu</p>
                        <p class="small mb-1" v-else>{{ message.sender }}</p>
                        <p class="small mb-1 text-muted">{{ message.time }}</p>
                    </div>
                    <div class="d-flex flex-row justify-content-start">
                        <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava5-bg.webp"
                            alt="avatar 1" class="avatar-img" />
                        <div class="message-content">
                            {{ message.content }}
                        </div>
                    </div>
                </div>
            </div>
            <div class="card-footer text-muted d-flex justify-content-between align-items-center p-3">
                <input v-model="newMessage" type="text" class="form-control chat-input" placeholder="Raksti ziņu" />
                <button @click="sendMessage" class="btn btn-primary btn-send">
                    <i class="fas fa-paper-plane"></i>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface ChatMessage {
    sender: string;
    content: string;
    time: string;
}

const messages = ref<ChatMessage[]>([]);
const newMessage = ref<string>('');

const getCurrentTime = (): string => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
};

const sendMessage = () => {
    if (newMessage.value.trim() !== '') {
        messages.value.push({
            sender: 'You',
            content: newMessage.value.trim(),
            time: getCurrentTime(),
        });
        newMessage.value = '';
    }
};
</script>

<style scoped>
/* Styles for the chat modal */
.chat-container {

    /* White background */
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 9999;
    padding: 30px;
    width: 300px;
}

.chat-card {
    border: 1px solid #ccc;
    border-radius: 10px;
    overflow-y: auto;
    height: 400px;
    width: 100%;
}

.chat-body {
    position: relative;
    padding: 10px;
}

.chat-message {
    padding: 10px;
    margin-bottom: 10px;
}

.avatar-img {
    width: 45px;
    height: 100%;
}

.message-content {
    padding: 10px;
    background-color: #007bff;
    /* Blue background for messages */
    color: #fff;
    border-radius: 20px;
}

.chat-input {
    border: none;
    background-color: #f2f2f2;
    /* Light gray background for input */
}

.btn-send {
    background-color: #007bff;
    border-color: #007bff;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
