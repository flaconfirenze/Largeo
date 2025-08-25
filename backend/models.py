from pydantic import BaseModel, EmailStr
from typing import Optional

class LoginRequest(BaseModel):
    nd: str
    password: str

class RegisterRequest(BaseModel):
    nd: str
    ncli: str
    mobile: str
    email: EmailStr
    password: str

class ConfirmRegisterRequest(BaseModel):
    nd: str
    otp: str

class CheckNdFactRequest(BaseModel):
    nd: str

class VoucherRequest(BaseModel):
    nd: str
    ncli: str
    voucher: str

class VoucherLteRequest(BaseModel):
    nd: str
    voucher: str

class NcliRequest(BaseModel):
    nd: str

class Ncli4gLteRequest(BaseModel):
    nd: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None
