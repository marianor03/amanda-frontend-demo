# Amanda — Frontend

> A calm, ethically framed AI conversational interface for mental health support.

**[▶ View the live demo](https://marianor03.github.io/amanda-frontend-demo/)**

---

## About this repository

Amanda was my final-year dissertation project at the University of Roehampton, built by a **team of four**. **I was responsible for the frontend and UX/UI**: the public site, the full authentication flow, the real-time chat dashboard with voice input, the animated AI orb, the design system, and the React admin dashboard, plus the production deployment infrastructure. The AI backend was developed independently by other team members.

This repository contains **my frontend work, adapted into a static demo** so it can be explored in a browser without running a server.

---

## ⚠️ This is a static demo

There is no backend running behind this site. To make the interface explorable, the API client, the WebSocket layer and the socket.io client have been replaced with mocks.

**What that means when you click around:**

- **Any email and password will log you in.** Nothing is validated or stored.
- **Amanda's replies are pre-written** and cycle through a short list. There is no AI, no language model, no conversation memory.
- **Voice mode renders the orb and simulates a reply**, but no audio is recorded, transmitted, or synthesised.
- Everything else — the layout, the animations, the streaming typewriter effect, the theming, the navigation — is the real implementation.

The mocked files are `static/js/api.js`, `static/js/websocket.js` and `static/js/mock-socketio.js`. Every other file is the code as it was written for the live application.

---

## The problem

Mental health services face rising demand, long waiting lists, and barriers of cost and stigma. Digital tools have grown to fill that gap, but many feel clinical, cold, or cognitively overwhelming, precisely when a person is least able to cope with friction.

Existing conversational tools tend to either over-structure the interaction (scripted, repetitive) or bury it inside feature-rich interfaces that create pressure rather than relieve it. There was also a recurring ethical gap: systems that let users believe they were receiving therapy.

Amanda was built to test a different position: **that thoughtful interface design can make an AI tool feel genuinely supportive, while being honest about what it is.**

---

## Design principles

Three principles shaped every decision in the interface.

**Calm visual design.** A warm terracotta and cream palette instead of the clinical white and blue common to health applications. Lexend Deca for legibility. Glass morphism on the chat input so it recedes rather than demands attention. A soft three-body loading animation instead of a spinner — it signals the system is working without creating urgency.

**Low cognitive load.** A linear, predictable navigation flow. Public content, authentication and the conversation kept in clearly separated zones. Responses stream in progressively via a typewriter effect, which both reduces perceived waiting time and makes the exchange feel closer to a real conversation.

**Ethical transparency.** Amanda never presents itself as a therapist. This is stated on the landing page, the About page, the Terms, and in-app. A crisis detection banner surfaces safeguarding resources when signs of serious distress appear in a conversation.

---

## The animated orb

During voice mode, a Three.js orb serves as the visual anchor — something to focus on while speaking. It uses noise-based vertex displacement on a sphere geometry with a slow colour shift, giving it a breathing quality rather than a mechanical rotation. It appears only in voice mode and recedes when the user returns to text, so it never competes with the conversation.

---

## What was actually built

| | |
|---|---|
| **Public site** | Landing, About, Contact, Terms — mobile-responsive with hamburger navigation |
| **Authentication** | Registration with real-time password strength validation, email verification, login, password recovery and reset |
| **Chat dashboard** | Real-time streaming responses, voice input, chat history sidebar with rename/delete, swipe-to-open on mobile, profile and settings panels, personalisation onboarding |
| **Admin dashboard** | A separate React + TypeScript SPA for monitoring users, conversations, study sessions and risk alerts — not included in this static build |
| **Theming** | Full light and dark modes across both the user-facing and administrative interfaces |
| **Deployment** | Multi-stage Docker build, Gunicorn with Gevent workers, PostgreSQL |

---

## Tech stack

**This frontend:** HTML, CSS, vanilla JavaScript (ES modules), Three.js.

The absence of a framework was deliberate. The user-facing interface is essentially one page with well-contained state; React would have added a build step, a bundler config and a dependency tree for no functional gain, and Tailwind would have fought the design system already expressed in CSS custom properties.

**The wider application:** Flask (blueprint architecture), Flask-SocketIO for real-time streaming, PostgreSQL, gRPC to a separate AI service, Docker, Gunicorn + Gevent.

**The admin dashboard**, where the complexity genuinely justified it: React, TypeScript, Vite, Tailwind CSS, shadcn/ui, Recharts.

---

## Evaluation

The interface was evaluated through a user testing study with **79 participants**, assessed across four areas on a five-point scale.

| Area | Score |
|---|---|
| Trust and ethical framing | **4.14** |
| Overall rating | **4.09** |
| First impressions and visual design | 3.99 |
| Usability and navigation | 3.89 |

The strongest single result was the question asking whether it was clear that Amanda is an AI tool and not a therapist or a human — **4.23 out of 5**. That was the point of the exercise.

Open-ended responses returned "calm", "clean", "warm", "friendly" and "relaxing" repeatedly, which was the design goal stated at the outset.

**The weakest area was usability**, and specifically the sign-up flow. Every participant was frustrated by a login prompt appearing immediately after registration, and most struggled with a disclaimer that gave no indication it needed scrolling. A meaningful finding I did not anticipate: several participants whose first language was not English asked for a Spanish option. Accessibility, in a tool meant to lower barriers, had been considered too narrowly.

---

## Running it locally

```bash
git clone https://github.com/marianor03/amanda-frontend-demo.git
cd amanda-frontend-demo
python -m http.server 8000
```

Then open `http://localhost:8000/`.

---

## Credits

Amanda was built by a four-person team as a final-year project at the University of Roehampton. The AI backend, gRPC voice service and conversational logic were developed by my teammates. The frontend, UX/UI and deployment infrastructure documented here are my contribution.

Built by **Mariano Regalado** — [LinkedIn](https://www.linkedin.com/in/mariano-antonio-regalado-iglesias-843685248/) · [GitHub](https://github.com/marianor03)
