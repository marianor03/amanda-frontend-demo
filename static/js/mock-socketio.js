/**
 * MOCK SOCKET.IO — static demo only.
 *
 * Replaces the real socket.io client. Defines a global `io()` factory that
 * returns a fake socket speaking the same events as the Flask-SocketIO backend:
 *
 *   emit:   'send_message'      { chat_id, message }
 *   listen: 'message_token'     { text }
 *           'message_complete'  { full_text, message_id }
 *           'error'             { message }
 *
 * Instead of calling the AI backend, it streams a canned reply character by
 * character, preserving the typewriter effect of the real app.
 */

(function () {
    'use strict';

    // Canned replies, cycled through so repeated messages don't feel identical.
    const REPLIES = [
        "Thank you for telling me that — it isn't a small thing to say out loud.\n\nCan you tell me a little more about how that's been sitting with you?",
        "That sounds genuinely heavy, and it makes sense that it's been on your mind.\n\nWhat part of it feels hardest right now?",
        "I'm listening. There's no rush here, and nothing you say has to be tidy.\n\nWhen did you first start noticing this?",
        "It takes something to put that into words. Thank you.\n\nHow have you been coping with it day to day?"
    ];

    let replyIndex = 0;

    // Speed of the typewriter effect (ms per chunk).
    const TOKEN_DELAY_MS = 18;
    const THINKING_DELAY_MS = 700;

    class MockSocket {
        constructor() {
            this.handlers = {};
            this.connected = true;
            // Mimic socket.io's async connect
            setTimeout(() => this._fire('connect'), 50);
        }

        on(event, callback) {
            (this.handlers[event] = this.handlers[event] || []).push(callback);
            return this;
        }

        off(event) {
            delete this.handlers[event];
            return this;
        }

        _fire(event, payload) {
            (this.handlers[event] || []).forEach(cb => {
                try {
                    cb(payload);
                } catch (err) {
                    console.error(`[mock-socket] handler for "${event}" threw:`, err);
                }
            });
        }

        emit(event, payload) {
            if (event === 'send_message') {
                this._streamReply(payload);
            } else {
                console.log(`[mock-socket] ignored emit "${event}"`, payload);
            }
            return this;
        }

        async _streamReply({ chat_id }) {
            const fullText = REPLIES[replyIndex % REPLIES.length];
            replyIndex += 1;

            // Let the three-body loader show, as it would while the AI thinks.
            await new Promise(res => setTimeout(res, THINKING_DELAY_MS));

            // Stream in small chunks rather than per-character: fewer repaints,
            // and it reads closer to how real tokens arrive.
            const chunks = fullText.match(/.{1,3}/gs) || [];
            for (const text of chunks) {
                this._fire('message_token', { text });
                await new Promise(res => setTimeout(res, TOKEN_DELAY_MS));
            }

            this._fire('message_complete', {
                full_text: fullText,
                message_id: Date.now(),
                chat_id
            });
        }

        disconnect() {
            this.connected = false;
            this._fire('disconnect');
            return this;
        }
    }

    // socket.io's public surface: `io(url, opts)` returns a socket.
    window.io = function mockIo() {
        console.info('[amanda demo] Using mock socket.io — no backend is connected.');
        return new MockSocket();
    };
})();
