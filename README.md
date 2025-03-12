F1 Data Crawler Server
======================

📌 Overview
-----------

This is a **Node.js + Express** server for crawling and serving **Formula 1 race data**. It uses **Puppeteer** for web scraping and **WebSocket** for real-time progress updates during data crawling. The server provides REST API endpoints to fetch race results, drivers, teams, and fastest lap records from **2018 to 2025**.

🚀 Features
-----------

-   **Web Scraping**: Uses Puppeteer to crawl race data from the official Formula 1 website.
-   **Real-time Progress**: WebSocket integration to display a progress bar and messages while crawling.
-   **REST API**: Serves the crawled data for frontend consumption.
-   **Data Storage**: Saves race results in JSON format for quick access.

📦 Demo Logs
--------------------
<img src="./images/demo-01.png" />

📂 Project Structure
--------------------

````
📦 server
┣ 📂 src
┃ ┣ 📂 api             # Contains API routes
┃ ┣ 📂 crawler         # Puppeteer crawling logic
┃ ┣ 📂 utils           # Helper functions and logging system
┃ ┣ 📜 index.ts        # Main server entry point
┃ ┣ 📜 config.ts       # Environment configuration
┃ ┗ 📜 logger.ts       # Logging system
┣ 📜 package.json      # Dependency and script configuration
┣ 📜 tsconfig.json     # TypeScript configuration
┣ 📜 .env.example      # Environment file example
┗ 📜 README.md         # Project documentation
````

⚙️ Setup & Installation
-----------------------

### 1️⃣ Prerequisites

-   **Node.js** (v16 or later)
-   **npm** or **yarn**
-   **Google Chrome** (or Chromium for Puppeteer)

### 2️⃣ Clone the Repository

`git clone https://github.com/your-repo/f1-crawler-server.git
cd f1-crawler-server`

### 3️⃣ Install Dependencies

`npm install  # or yarn install`

### 4️⃣ Configure Environment Variables

Copy the `.env.example` file and rename it to `.env`, then update values as needed:

`cp .env.example .env`

Edit `.env`:


`PORT=3000
WS_PORT=8080
CORS_ORIGIN=http://localhost:5173  # URL of the frontend`

### 5️⃣ Run the Server

#### ▶ Development Mode (with auto-restart)

`npm run dev  # Uses nodemon`

#### ▶ Production Mode

`npm start`

🔗 Frontend Integration
-----------------------

This backend is designed to work with the **F1 Data Visualization Frontend**, which is built using **React + TypeScript + Tailwind CSS**.

Frontend source: [Frontend Repository](https://github.com/duyenlan151/crawl-f1-client)