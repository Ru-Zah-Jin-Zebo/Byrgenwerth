# Backend Setup

cd Byrgenwerth
cd backend
touch .env
OPENAI_API_KEY=your_openai_api_key_here
docker-compose up -d --build

# Frontend setup

cd frontend
npm run dev

# Project Design

backend/
├──  app/
│    ├── api/ # Handles API Calls
│    ├── core/ # Stores config and settings for app
│    ├── models/ # Handles Data transfer objects(chat models)
│    └── services/ # Hosts the simple chat agent
frontend/
├──  src/
│    ├── app/ # Hosts the single page application tsx as well as layout and some placeholder routing logic
│    ├── components/ # Holds all necessary components and ui for application
│    └── lib/ # Hosts API Logic to send and retrieve messages from backend

## Key Design Decisions:

The bulk of the actual libraries were chosen for me in the project requirements doc so I will try and elaborate on the pieces I contributed.

### Theme Toggle

Implemented theme toggling because it is basically built in to shadui and tailwindcss so it was easy to implement.

### Stream Toggle

Threw this in to ease the ability to test both streaming and batching.

### State Management

I used React's useState and useEffect hooks for component-level state management, avoiding unnecessary complexity from external state libraries for this relatively simple application. The chat history is maintained in the frontend's state, with all context sent to the backend on each request to maintain conversation coherence. I've also implemented separate state variables for streaming messages vs. completed messages to provide real-time updates while maintaining a clean UI when streams complete.

### Error Handling

The UI shows appropriate error states when the backend can't be reached or returns an error, maintaining a good user experience even in failure scenarios.

# AI Tooling

## Claude (Anthropic's LLM): Used extensively during development for:

Troubleshooting compatibility issues between libraries (particularly with LangChain versions)
Recommending best practices for implementing streaming responses


## GitHub Copilot: Used for code completion and suggestions, particularly for:

Common utility functions
Light code suggestions 

Both AI tools significantly accelerated development while maintaining code quality, though all suggested code was reviewed, tested, and modified as needed to ensure it met project requirements and maintained best practices within the alloted time.