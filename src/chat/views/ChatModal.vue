<template>
    <section class="chat-modal">
        <div class="container py-5">
            <div class="row d-flex justify-content-center">
                <div class="col-md-8 col-lg-6 col-xl-4">
                    <div class="card">
                        <div class="card-header d-flex justify-content-between align-items-center p-3"
                            style="border-top: 4px solid #ffa900;">
                            <h5 class="mb-0">Chat messages</h5>
                            <div class="d-flex flex-row align-items-center">
                                <span class="badge bg-warning me-3">20</span>
                                <i class="fas fa-minus me-3 text-muted fa-xs"></i>
                                <i class="fas fa-comments me-3 text-muted fa-xs"></i>
                                <i class="fas fa-times text-muted fa-xs"></i>
                            </div>
                        </div>
                        <div class="card-body" data-mdb-perfect-scrollbar="true" style="position: relative; height: 400px">
                            <!-- Chat messages display -->
                            <div v-for="(message, index) in messages" :key="index" class="chat-message">
                                <div class="message-sender">{{ message.sender }}</div>
                                <div class="message-content">{{ message.content }}</div>
                            </div>

                            <!-- Input field for typing messages -->
                            <div class="input-group mt-3">
                                <input v-model="newMessage" type="text" class="form-control" placeholder="Type message" />
                                <button @click="sendMessage" class="btn btn-warning" type="button">Send</button>
                            </div>
                        </div>
                        <div class="card-footer text-muted d-flex justify-content-start align-items-center p-3">
                            <div class="input-group mb-0">
                                <input type="text" class="form-control" placeholder="Type message"
                                    aria-label="Recipient's username" aria-describedby="button-addon2" />
                                <button class="btn btn-warning" type="button" id="button-addon2"
                                    style="padding-top: .55rem;">Button</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>


<script setup lang="ts">
import { ref } from 'vue';

interface ChatMessage {
    sender: string;
    content: string;
}

const messages = ref<ChatMessage[]>([]);

const newMessage = ref<string>('');

const sendMessage = () => {
    if (newMessage.value.trim() !== '') {
        messages.value.push({
            sender: 'You',
            content: newMessage.value.trim(),
        });
        newMessage.value = '';
    }
};
</script>

<style scoped>
/* Styles for the chat modal */
.chat-modal {
    /* Add your modal styles here */
}

.chat-message {
    margin-bottom: 10px;
    padding: 10px;
    background-color: #f5f6f7;
    border-radius: 8px;
}

.message-sender {
    font-weight: bold;
    margin-bottom: 5px;
}

.input-group {
    margin-top: 20px;
}
</style>
