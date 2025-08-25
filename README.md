# Algeria Telecom Web Client

This project is a web application that replicates the functionalities of the provided Python script, which is a Telegram bot for an Algerian telecom company.

The application is built with a React frontend and a FastAPI backend, configured for deployment on Cloudflare Pages and Cloudflare Workers.

## Project Structure

- `frontend/`: Contains the React.js single-page application.
- `backend/`: Contains the FastAPI Python backend.
- `worker.py`: The entrypoint for the Cloudflare Worker.
- `wrangler.toml`: Configuration for the Cloudflare Worker.
- `package.json`: Root package file to orchestrate builds.

## How to Run Locally

### Backend

1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```

2.  Create a virtual environment and activate it:
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows use `venv\Scripts\activate`
    ```

3.  Install the required dependencies:
    ```bash
    pip install -r requirements.txt
    ```

4.  Run the backend server:
    ```bash
    uvicorn main:app --reload
    ```
    The backend will be running on `http://127.0.0.1:8000`.

### Frontend

1.  Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```

2.  Install the required dependencies:
    ```bash
    npm install
    ```

3.  Run the frontend development server:
    ```bash
    npm start
    ```
    The frontend will be running on `http://localhost:3000` and will be proxied to the backend for local development.

## How to Deploy to Cloudflare

This project is configured for a two-part deployment to Cloudflare:

1.  **Backend to Cloudflare Workers:** The FastAPI backend is deployed as a serverless worker.
2.  **Frontend to Cloudflare Pages:** The React frontend is deployed as a static site that communicates with the worker.

### 1. Deploy the Backend

First, deploy the backend worker using the Wrangler CLI.

1.  Install `wrangler` from the root of the project:
    ```bash
    npm install
    ```

2.  Log in to your Cloudflare account:
    ```bash
    npx wrangler login
    ```

3.  Deploy the worker:
    ```bash
    npx wrangler deploy
    ```
    After deployment, Wrangler will output the URL of your worker (e.g., `https://algerie-telecom-api.your-username.workers.dev`). **Copy this URL.**

### 2. Configure and Deploy the Frontend

First, you will deploy the frontend. It may not work correctly until the backend is configured in the next step.

1.  **Update the API URL:**
    - Open the `frontend/.env.production` file.
    - Replace the placeholder URL in `REACT_APP_API_URL` with the actual URL of your deployed worker from the previous step.

2.  **Deploy to Cloudflare Pages:**
    - Connect your GitHub repository to a new Cloudflare Pages project.
    - Use the following build settings:
        - **Framework preset:** `Create React App`
        - **Build command:** `npm run build`
        - **Build output directory:** `frontend/build`
        - **Root directory:** Leave this empty (repository root).
    - After deploying, you will have a URL for your frontend (e.g., `https://your-project.pages.dev`). **Copy this URL.**

### 3. Configure Backend CORS

Now, you must configure the backend to accept requests from your deployed frontend.

1.  Go to your Cloudflare dashboard.
2.  Navigate to `Workers & Pages` and select your `algerie-telecom-api` worker.
3.  Go to the `Settings` tab, then click on `Variables`.
4.  Under `Environment Variables`, click `Add variable`.
5.  Set the `Variable name` to `FRONTEND_URL`.
6.  Set the `Value` to the full URL of your deployed frontend from the previous step (e.g., `https://your-project.pages.dev`).
7.  Click `Save and deploy`. This will redeploy your worker with the new setting, allowing it to accept requests from your frontend.
