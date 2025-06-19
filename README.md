# Dio Chat

A modern, responsive chat application built with React and Vite. Dio Chat provides a clean and intuitive interface for real-time messaging with support for multiple chat sessions.

## Features

- 🚀 Fast and responsive UI built with React
- 💬 Multiple chat sessions with persistent storage
- ✏️ Edit and delete chat sessions
- 🎨 Clean and modern interface
- 📱 Mobile-friendly design

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Docker (optional, for containerized deployment)

## Getting Started

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/dio-chat.git
   cd dio-chat
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production

```bash
npm run build
# or
yarn build
```

## Docker Deployment

Dio Chat can be easily deployed using Docker:

1. Build the Docker image:
   ```bash
   docker build -t dio-chat .
   ```

2. Run the container:
   ```bash
   docker run -d -p 80:80 --name dio-chat dio-chat
   ```

3. Access the application at [http://localhost](http://localhost)

### Docker Compose

For a more complete setup with environment variables, you can use Docker Compose:

1. Create a `docker-compose.yml` file:
   ```yaml
   version: '3.8'
   services:
     dio-chat:
       build: .
       ports:
         - "80:80"
       restart: unless-stopped
       environment:
         - NODE_ENV=production
   ```

2. Start the services:
   ```bash
   docker-compose up -d
   ```

## Configuration

Environment variables can be set in a `.env` file:

```env
VITE_API_BASE_URL=http://your-api-url
```
