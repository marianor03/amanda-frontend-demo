/**
 * MOCK API CLIENT — static demo only.
 *
 * Drop-in replacement for the real `api.js`. Exports the same `api` singleton
 * with identical method signatures and response shapes, so dashboard.js runs
 * unchanged. No network calls are made.
 *
 * The real client talks to the Flask backend (see the full project repo).
 */

// --- Fake latency so the UI's loading states are actually visible -----------
const delay = (ms = 220) => new Promise(res => setTimeout(res, ms));

// --- Demo data -------------------------------------------------------------
const DEMO_USER = {
    id: 1,
    email: 'demo@amanda.app',
    created_at: '2026-03-01T10:00:00Z'
};

const now = () => new Date().toISOString();

let demoChats = [
    {
        id: 1,
        title: 'Problems at home',
        created_at: '2026-05-04T18:12:00Z',
        last_message_time: '2026-05-04T18:14:00Z'
    },
    {
        id: 2,
        title: 'Feeling overwhelmed at work',
        created_at: '2026-05-02T09:30:00Z',
        last_message_time: '2026-05-02T09:41:00Z'
    }
];

const demoMessages = {
    1: [
        {
            id: 101,
            role: 'user',
            content: 'Amanda, I\'m having problems at home.',
            timestamp: '2026-05-04T18:12:30Z'
        },
        {
            id: 102,
            role: 'assistant',
            content:
                'That sounds really hard to carry on your own, and I\'m glad you reached out instead of staying alone with it.\n\nWhen you say "problems at home," what\'s been feeling most difficult for you lately?',
            timestamp: '2026-05-04T18:12:38Z'
        }
    ],
    2: [
        {
            id: 201,
            role: 'user',
            content: 'I can\'t switch off after work anymore.',
            timestamp: '2026-05-02T09:30:20Z'
        },
        {
            id: 202,
            role: 'assistant',
            content:
                'It makes sense that your mind keeps running — it hasn\'t been given a chance to land.\n\nWhat does the evening usually look like once you finish?',
            timestamp: '2026-05-02T09:30:29Z'
        }
    ]
};

let nextChatId = 3;
let nextMessageId = 1000;

// Exposed so the mock socket can append the user's message and read history.
export const __demoStore = {
    get chats() { return demoChats; },
    messages: demoMessages,
    nextMessageId: () => ++nextMessageId,
    user: DEMO_USER
};

// --- Mock client -----------------------------------------------------------
class MockAPI {
    async signup(email) {
        await delay();
        return { success: true, data: { message: 'Verification email sent', email }, status: 200 };
    }

    async login(email) {
        await delay();
        return { success: true, data: { user: { ...DEMO_USER, email } }, status: 200 };
    }

    async logout() {
        await delay(120);
        return { success: true, data: { message: 'Logged out' }, status: 200 };
    }

    async checkAuth() {
        await delay(120);
        // Always "logged in" so the demo dashboard is reachable directly.
        return { success: true, data: { authenticated: true, user: DEMO_USER }, status: 200 };
    }

    async getProfile() {
        await delay(150);
        return { success: true, data: { ...DEMO_USER }, status: 200 };
    }

    async listChats() {
        await delay();
        return { success: true, data: { chats: [...demoChats] }, status: 200 };
    }

    async createChat() {
        await delay();
        const chat = {
            chat_id: nextChatId,
            title: 'New Chat',
            created_at: now()
        };
        demoChats = [
            { id: chat.chat_id, title: chat.title, created_at: chat.created_at, last_message_time: chat.created_at },
            ...demoChats
        ];
        demoMessages[chat.chat_id] = [];
        nextChatId += 1;
        return { success: true, data: chat, status: 201 };
    }

    async getChatMessages(chatId) {
        await delay(180);
        const messages = demoMessages[chatId] ? [...demoMessages[chatId]] : [];
        return { success: true, data: { messages }, status: 200 };
    }

    async renameChat(chatId, title) {
        await delay(150);
        const chat = demoChats.find(c => c.id === Number(chatId));
        if (chat) chat.title = title;
        return { success: true, data: { title }, status: 200 };
    }

    async deleteChat(chatId) {
        await delay(150);
        demoChats = demoChats.filter(c => c.id !== Number(chatId));
        delete demoMessages[chatId];
        return { success: true, data: { message: 'Chat deleted' }, status: 200 };
    }
}

export const api = new MockAPI();
