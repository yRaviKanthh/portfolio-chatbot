# Portfolio Chatbot

## Overview

The Portfolio Chatbot is an AI-powered web application that answers questions about my skills, projects, education, internships, certifications, and professional experience.

The chatbot combines multiple knowledge sources, including website content collected through web scraping and a knowledge base containing my resume and professional information. It uses the OpenAI API to generate accurate, context-aware responses and can also generate images and graphs when requested.

---

## Features

- AI-powered portfolio chatbot
- Website content training through web scraping
- Resume and knowledge base integration
- Context-aware question answering
- Generates responses using the OpenAI API
- Supports AI-generated images and graphs
- Node.js backend
- HTML frontend
- Easy to extend with additional knowledge sources

---

## Tech Stack

- JavaScript
- Node.js
- HTML
- Express.js
- OpenAI API
- Puppeteer
- Website Scraping
- Knowledge Base Integration

---

## Project Structure

```
portfolio-chatbot/
│
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── server.js
├── trainWebsite.js
├── package.json
├── package-lock.json
└── .gitignore
```

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yRaviKanthh/portfolio-chatbot.git

cd portfolio-chatbot
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root.

```env
OPENAI_API_KEY=your_openai_api_key
```

Replace `your_openai_api_key` with your own OpenAI API key.

---

## Run the Project

```bash
npm start
```

The application will start on your local server.

---

## How It Works

1. Website content is collected through web scraping.
2. Resume information is added as a knowledge base.
3. User submits a question through the chatbot interface.
4. Relevant website and resume information are used as context.
5. The OpenAI API generates an accurate and context-aware response.
6. For supported requests, the chatbot can also generate AI-powered images and graphs.

---

## Example Use Cases

Users can ask questions such as:

- Tell me about your projects.
- What programming languages do you know?
- What internships have you completed?
- Explain your technical skills.
- Generate an image.
- Create a graph from provided data.
- Summarize your experience.

---

## Skills Demonstrated

- AI Application Development
- Prompt Engineering
- OpenAI API Integration
- Website Scraping
- Backend Development
- REST API Development
- Knowledge Base Integration
- Context-Aware AI Responses
- JavaScript
- Node.js
- HTML

---

## Requirements

- Node.js
- npm
- OpenAI API Key
- Internet Connection

---

## Important Note

This project requires a valid OpenAI API key.

Without an OpenAI API key, the chatbot cannot:

- Generate AI responses
- Generate images
- Generate graphs
- Process AI-powered requests

Website scraping and knowledge base preparation are included in the project, but AI features require access to the OpenAI API.

---

## Future Improvements

- Conversation history
- User authentication
- Voice interaction
- PDF knowledge base support
- Multiple website training
- Database integration
- Deployment to cloud platforms

---

## License

This project is licensed under the MIT License.

---

## Author

**Ravikanth**

GitHub: https://github.com/yRaviKanthh
