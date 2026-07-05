# FeedbackIQ: AI-Powered Triage Engine

A high-performance B2B SaaS dashboard designed for intelligent customer feedback management.

## Technical Architecture
FeedbackIQ is built with a modular service-oriented architecture:
- **Service Layer:** Abstracts LLM interactions via a dedicated `aiService.ts`, allowing for model-agnostic development and cost-efficient batch processing.
- **Triage Pipeline:** Implements a batching strategy (5 items/call) to optimize API token consumption and reduce latency.
- **State Management:** Localized browser-sync state coupled with reactive AI status tracking.

## Deployment Instructions
1. Run `npm install` to load dependencies.
2. Create `.env.local` and add `VITE_GEMINI_API_KEY`.
3. Run `npm run dev` to start the development server.

## Key Features
- **Semantic Classification:** Replaced brittle regex/keywords with LLM-based intent analysis.
- **Contextual Drafting:** AI-assisted email generation based on customizable response tones.
- **Operational Analytics:** Real-time KPI tracking for triage efficiency and sentiment trends.
