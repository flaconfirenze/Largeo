# Algeria Telecom Web Client

This project is a web application that replicates the functionalities of the provided Python script, which is a Telegram bot for an Algerian telecom company.

The application is built with a React frontend and a FastAPI backend.

## Project Structure

- `frontend/`: Contains the React.js single-page application.
- `backend/`: Contains the FastAPI Python backend.

## How to Run

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
    The frontend will be running on `http://localhost:3000` and will be proxied to the backend.

## Next Steps

The current state of the application is a basic scaffold. The next steps are to:

1.  Implement the logic for each of the frontend components to interact with the backend API.
2.  Implement proper state management for the user's authentication token.
3.  Add more detailed UI components for each feature.
4.  Improve error handling and user feedback.
