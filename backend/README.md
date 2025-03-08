# Setup Instructions

git clone https://github.com/Ru-Zah-Jin-Zebo/Byrgenwerth.git
cd Byrgenwerth
cd backend
touch .env
OPENAI_API_KEY=your_openai_api_key_here
docker-compose up -d --build

## Authentication

In it's current state the backend utilizes an Open API key that must be set in the users environment

The easiest way to test is to create a .env and place your API key as follows:

OPENAI_API_KEY={YOU_OPEN_API_KEY}

For a production deployment, I would implement API key authentication as follows:

### API Key Authentication

For machine-to-machine communication, I would implement API key authentication:

1. Create a database table to store API keys associated with users using django or some other sql based database
2. Add an API key header requirement for all endpoints
3. Implement middleware to validate API keys before processing requests
4. Implement rate limiting based on API key

### Other Considerations

If I had the resources I might use an opensource model to avoid keys altogether

