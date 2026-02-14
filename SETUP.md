# Glassbox OSS - Setup Guide

## How It Works

Glassbox OSS is a full-stack app that performs AI-powered operational intelligence on any public GitHub repository. You paste a GitHub repo URL and it returns risk analysis, failure simulations, security audits, and recovery playbooks.

### Architecture

**Backend** (Python/FastAPI on port 8000):

1. **Ingestion** (`app/services/ingestion.py`) — Takes a GitHub URL, calls the GitHub API to fetch the repo's README, file tree, languages, and key config files (package.json, Dockerfile, etc.)
2. **6-Pass Analysis Pipeline** (`app/services/analyzer.py`) — Sends the repo content through 6 sequential Claude API calls, each with a specialized prompt:
   - **Pass 1: System Overview** — architecture, components, data flows
   - **Pass 2: Setup Risk Radar** — dependency/config/environment risks
   - **Pass 3: Failure Timeline** — simulated failure scenarios over 3 months
   - **Pass 4: Security & Data Exposure** — threat assessment
   - **Pass 5: Safe Execution Plan** — step-by-step local run guide
   - **Pass 6: Recovery Strategy** — rollback/recovery playbooks
3. Results are streamed to the frontend as **Server-Sent Events (SSE)**, so each pass result appears as soon as it's ready.

**Frontend** (Next.js/React on port 3000):

- A single-page app with a URL input bar
- Uses a custom `useAnalysis` hook that opens an SSE stream to the backend
- As each pass completes, its result panel animates in (using Framer Motion)
- Has dedicated panel components for each pass type (SystemOverview, SetupRiskRadar, FailureTimeline, SecurityRisk, SafeRunPlan, RecoveryStrategy)

---

## Running Locally

### Prerequisites

- Python 3.12+
- Node.js (for the Next.js frontend)
- An Anthropic API key
- (Optional) A GitHub token for higher API rate limits

### 1. Start the Backend

```bash
cd backend
source venv/bin/activate
```

Make sure `backend/.env` has your keys set:

```
ANTHROPIC_API_KEY=your-key-here
GITHUB_TOKEN=your-github-token-here   # optional
```

Then run:

```bash
uvicorn app.main:app --reload --port 8000
```

### 2. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

This starts Next.js on `http://localhost:3000`.

### 3. Use It

Open `http://localhost:3000` in your browser, paste a public GitHub repo URL (e.g. `https://github.com/expressjs/express`), and submit. You'll see the 6 analysis passes stream in one by one.

### Configuration

The backend defaults to using `claude-opus-4-6` as the model. You can change this and other settings in `backend/app/config.py`:

| Setting              | Default           | Description                        |
| -------------------- | ----------------- | ---------------------------------- |
| `model_name`         | `claude-opus-4-6` | Claude model to use for analysis   |
| `max_content_size`   | `15000`           | Max characters for README content  |
| `max_file_size`      | `8000`            | Max characters per config file     |
