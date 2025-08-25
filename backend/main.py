from fastapi import FastAPI, Depends, HTTPException, status
import os
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from passlib.context import CryptContext
from datetime import datetime, timedelta
from typing import Optional

from models import (
    LoginRequest, RegisterRequest, ConfirmRegisterRequest, CheckNdFactRequest,
    VoucherRequest, VoucherLteRequest, NcliRequest, Ncli4gLteRequest, Token
)
from api_client import APIClient

# --- Configuration ---
SECRET_KEY = "a_very_secret_key"  # In a real app, use environment variables
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# --- FastAPI App Initialization ---
app = FastAPI()

# --- CORS Middleware ---
# Get the frontend URL from an environment variable.
# This allows us to configure the CORS policy for production.
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

# The origins that are allowed to make cross-site requests.
origins = [
    "http://localhost:3000",  # For local development
]
# Add the production URL to the list if it's set and different from localhost.
if FRONTEND_URL and FRONTEND_URL not in origins:
    origins.append(FRONTEND_URL)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- API Client Dependency ---
async def get_api_client():
    client = APIClient()
    try:
        yield client
    finally:
        await client.close()

# --- Authentication ---
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

async def get_current_user(token: str = Depends(oauth2_scheme), client: APIClient = Depends(get_api_client)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        # In a real app, we would decode the JWT.
        # Here, we pass the token directly to the get_account_info endpoint.
        # This is a simplification because the external API manages the token.
        # We are not creating our own JWTs for users of our webapp, but passing through the API's token.
        # A better approach would be to create our own JWT that wraps the external API token.
        # For this task, we will just pass it.

        # Let's check if the token is valid by getting account info
        user_info = await client.get_account_info(token)
        return user_info
    except Exception:
        raise credentials_exception


# --- API Endpoints ---

@app.post("/api/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), client: APIClient = Depends(get_api_client)):
    try:
        response = await client.login(form_data.username, form_data.password)
        token = response.get("meta_data", {}).get("original", {}).get("token")
        if not token:
            raise HTTPException(status_code=400, detail="Login failed, no token received.")
        return {"access_token": token, "token_type": "bearer"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/register")
async def register(request: RegisterRequest, client: APIClient = Depends(get_api_client)):
    try:
        response = await client.register(request.dict())
        return response
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/confirm-register")
async def confirm_register(request: ConfirmRegisterRequest, client: APIClient = Depends(get_api_client)):
    try:
        response = await client.confirm_register(request.dict())
        return response
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/account-info")
async def get_account_info(token: str = Depends(oauth2_scheme), client: APIClient = Depends(get_api_client)):
    try:
        account_info = await client.get_account_info(token)
        return account_info
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

@app.post("/api/check-nd-fact")
async def check_nd_fact(request: CheckNdFactRequest, client: APIClient = Depends(get_api_client)):
    try:
        response = await client.check_nd_fact(request.nd)
        return response
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/use-voucher")
async def use_voucher(request: VoucherRequest, client: APIClient = Depends(get_api_client)):
    try:
        response = await client.use_voucher(request.nd, request.ncli, request.voucher)
        return response
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/use-voucher-lte")
async def use_voucher_lte(request: VoucherLteRequest, client: APIClient = Depends(get_api_client)):
    try:
        # This endpoint needs ncli and type1. The frontend will first need to call check_nd_lte.
        check_lte_response = await client.check_nd_lte(request.nd)
        if check_lte_response and check_lte_response.get('code') == '0':
            type1 = check_lte_response.get('type1')
            ncli_lte = check_lte_response.get('ncli')
            if not ncli_lte:
                raise HTTPException(status_code=400, detail="Could not find LTE NCLI.")

            response = await client.use_voucher_lte(request.nd, ncli_lte, request.voucher, type1)
            return response
        else:
            error_message = check_lte_response.get('message', "Failed to verify LTE number.")
            raise HTTPException(status_code=400, detail=error_message)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/retrieve-ncli")
async def retrieve_ncli(request: NcliRequest, client: APIClient = Depends(get_api_client)):
    try:
        response = await client.retrieve_ncli(request.nd)
        return response
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/retrieve-ncli-4glte")
async def retrieve_ncli_4glte(request: Ncli4gLteRequest, client: APIClient = Depends(get_api_client)):
    try:
        response = await client.retrieve_ncli_4glte(request.nd)
        return response
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/")
def read_root():
    return {"message": "Welcome to the Algeria Telecom API wrapper."}

# To run the app:
# uvicorn main:app --reload
