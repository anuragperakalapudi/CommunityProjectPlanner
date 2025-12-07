# AI-assisted development notes

This project was designed and implemented by me. I used an AI assistant in a few focused places to speed up busy work, polish the UI, and sanity-check some implementation details.

Below are representative snippets of how I used it. These are not full chat logs, just the kinds of prompts I actually used.

---

## 1. Architecture sanity check

**Prompt A – overall design + docs**

> Me: I’m building a small app on Cloudflare using Workers AI, KV, and Pages. My plan is:  
> – A Worker exposes `/api/chat` and calls Workers AI  
> – KV stores per-project conversation history keyed by `projectId`  
> – Cloudflare Pages serves a static frontend that calls the Worker from the browser  
> Can you sanity-check this architecture and point me to the specific sections of the Cloudflare docs that are most relevant for this setup?

I used this mainly to confirm my understanding and which docs to read, not to generate code.

---

## 2. Backend details

**Prompt B – wiring Workers AI + KV in one handler**

> Me: I already have a Cloudflare Worker with an `/api/chat` route. I want it to:  
> 1) Read `{ projectId, projectTitle, message }` from the JSON body  
> 2) Load previous history for that `projectId` from KV  
> 3) Call Workers AI (`@cf/meta/llama-3-8b-instruct`) with a system prompt + history + new message  
> 4) Save the updated history back to KV and return `{ reply, state }` as JSON  
> Can you sketch a clean handler function for this flow in plain JavaScript for the Workers runtime?

I then edited the handler to match my exact data shape, error handling, CORS headers, and prompt wording.

**Prompt C – prompt tuning (response length)**

> Me: The model responses are good but sometimes they get cut off because they’re too long. Can you help me tighten my system prompt so it keeps answers around 250–300 words, uses headings and bullets, and doesn’t repeat the full project description?

I used this to refine the system prompt, then adjusted the exact wording myself.

---

## 3. Frontend wiring

**Prompt D – initial chat UI**

> Me: I have a deployed Worker at `/api/chat` that expects `{ projectId, projectTitle, message }` and returns `{ reply, state }`. Help me build a minimal `index.html` with vanilla JS that:  
> – Renders a chat history area  
> – Stores a stable `projectId` in `localStorage`  
> – Sends POST requests to my `/api/chat` endpoint  
> – Appends the assistant’s reply to the chat view  
> No frameworks, just HTML/CSS/JS so I can host it on Cloudflare Pages.

I took the structure and then wired it to my exact API URL and styling.

---

## 4. Frontend polish

**Prompt E – redesigning the UI**

> Me: Take this basic chat page and redesign it to feel like a clean, high-end AI product UI. I’d like:  
> – A dark theme with a glassy card layout  
> – A sidebar for “Project setup” and “Quick prompts”  
> – Modern buttons/chips inspired by open-source designs (like Uiverse), but not cluttered  
> Keep it in plain HTML + CSS + JS, and don’t change the way it calls `/api/chat`.

I then simplified the generated styles, removed anything over the top, and kept the layout focused on the core planning workflow.

---

## 5. Smaller, targeted prompts

**Prompt F – CORS + status UX**

> Me: I’m calling my Worker API from a Pages frontend. Can you remind me which CORS headers I need to add, and suggest a simple “Ready / Thinking…” status indicator pattern in the UI?

**Prompt G – README wording**

> Me: I want one short, clear paragraph for my README that explains how the Worker, KV, and Pages pieces fit together for this project, in non-marketing language. Can you draft something I can edit?

These were used as starting points; I edited the wording and integrated it into my own code and docs.

---

In all of these cases, I used AI as a helper for scaffolding, prompt phrasing, and UI polish. The core architecture, data flow, and integration with Cloudflare Workers AI, KV, and Pages were designed and assembled by me.
