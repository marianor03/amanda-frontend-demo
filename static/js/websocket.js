/**
 * MOCK VOICE CLIENT — static demo only.
 *
 * Drop-in replacement for the real `websocket.js`. Exports the same `chatSocket`
 * singleton so dashboard.js imports resolve unchanged.
 *
 * The real client opens a WebSocket to the gRPC voice service. Here, voice mode
 * still renders the animated orb, but nothing is recorded or transmitted: after
 * a short pause it returns a canned transcription and reply.
 */

const noop = () => {};

class MockVoiceSocket {
    constructor() {
        this._onTranscribed = noop;
        this._onProcessing = noop;
        this._onResponse = noop;
        this._onError = noop;
        this.voiceConnected = false;
    }

    async connectVoice() {
        this.voiceConnected = true;
        console.info('[amanda demo] Mock voice connection — no audio is captured or sent.');
        return { sessionId: 'demo-session' };
    }

    disconnect() {
        this.voiceConnected = false;
    }

    sendMessage() {
        throw new Error('sendMessage is not implemented. Text chat uses the mock socket.io client.');
    }

    async sendVoiceMessage(chatId) {
        if (!this.voiceConnected) await this.connectVoice();

        // Simulate: transcription → processing → response
        setTimeout(() => {
            this._onTranscribed({ text: "I've been feeling a bit overwhelmed lately.", chat_id: chatId });
        }, 600);

        setTimeout(() => {
            this._onProcessing({ status: 'thinking' });
        }, 900);

        setTimeout(() => {
            this._onResponse({
                text: "That's worth paying attention to. Overwhelm usually means something has been asking too much of you for a while.\n\nWhat's been taking up the most space?",
                chat_id: chatId,
                audio: null // no synthesised audio in the static demo
            });
        }, 2200);

        return { sessionId: 'demo-session' };
    }

    sendVoiceControl(command) {
        console.log(`[mock-voice] ignored control "${command}"`);
    }

    onVoiceTranscribed(cb) { this._onTranscribed = cb || noop; }
    onVoiceProcessing(cb)  { this._onProcessing  = cb || noop; }
    onVoiceResponse(cb)    { this._onResponse    = cb || noop; }
    onError(cb)            { this._onError       = cb || noop; }

    removeAllListeners() {
        this._onTranscribed = noop;
        this._onProcessing = noop;
        this._onResponse = noop;
        this._onError = noop;
    }

    isConnected() {
        return this.voiceConnected;
    }
}

export const chatSocket = new MockVoiceSocket();
