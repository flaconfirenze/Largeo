import httpx
import json
import logging

logger = logging.getLogger(__name__)

API_URL = "https://mobile-pre.at.dz/api"
PAIEMENT_URL = "https://paiement.algerietelecom.dz/AndroidApp"

class APIClient:
    def __init__(self, base_url=API_URL, paiement_url=PAIEMENT_URL):
        self.base_url = base_url
        self.paiement_url = paiement_url
        self.session = httpx.AsyncClient()

    async def close(self):
        await self.session.aclose()

    async def login(self, nd: str, password: str) -> dict:
        url = f"{self.base_url}/auth/login_new"
        payload = {"nd": nd, "password": password, "lang": "fr"}
        headers = {
            "Content-Type": "application/json; charset=utf-8",
            "User-Agent": "Dart/3.0 (dart:io)",
            "Accept-Encoding": "gzip"
        }
        try:
            response = await self.session.post(url, json=payload, headers=headers)
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as e:
            logger.error(f"Login failed: {e.response.status_code}")
            error_message = f"Login failed with status code: {e.response.status_code}"
            try:
                # Try to parse the error response from the external API
                error_body = e.response.json()
                # The external API might use 'message' or 'error' key
                if 'message' in error_body:
                    error_message = error_body['message']
                elif 'error' in error_body:
                    error_message = error_body['error']
            except Exception:
                # If the response is not JSON or key is not found, use the raw text
                error_message = e.response.text or error_message
            raise Exception(error_message)
        except Exception as e:
            logger.error(f"API request failed: {str(e)}")
            raise

    async def register(self, registration_data: dict) -> dict:
        url = f"{self.base_url}/auth/register"
        headers = {
            "Content-Type": "application/json; charset=utf-8",
            "User-Agent": "Dart/3.0 (dart:io)",
            "Accept-Encoding": "gzip"
        }
        # The original script sends password1 and password2, but our model has one password.
        # The API probably expects password and password_confirmation, or just one.
        # Let's assume the API can handle a single password field, or we might need to adjust.
        # For now, let's just send the password. The original script had password1 and password2.
        # Let's check the original script again. It sends password1 and password2.
        # I'll modify the payload to match.
        payload = {
            "nd": registration_data['nd'],
            "ncli": registration_data['ncli'],
            "mobile": registration_data['mobile'],
            "email": registration_data['email'],
            "password": registration_data['password'],
            "password_confirmation": registration_data['password'], # Assuming this might be the case
            "lang": "fr"
        }
        try:
            response = await self.session.post(url, json=payload, headers=headers)
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as e:
            logger.error(f"Registration failed: {e.response.status_code}")
            raise Exception(f"Registration failed: {e.response.status_code}")
        except Exception as e:
            logger.error(f"Registration request failed: {str(e)}")
            raise

    async def confirm_register(self, confirmation_data: dict) -> dict:
        url = f"{self.base_url}/auth/confirmRegister"
        headers = {
            "Content-Type": "application/json; charset=utf-8",
            "User-Agent": "Dart/3.0 (dart:io)",
            "Accept-Encoding": "gzip"
        }
        try:
            response = await self.session.post(url, json=confirmation_data, headers=headers)
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as e:
            logger.error(f"Registration confirmation failed: {e.response.status_code}")
            raise Exception(f"Registration confirmation failed: {e.response.status_code}")
        except Exception as e:
            logger.error(f"Registration confirmation request failed: {str(e)}")
            raise

    async def get_account_info(self, token: str) -> dict:
        url = f"{self.base_url}/compte_augmentation_debit"
        headers = {
            "Authorization": f"Bearer {token}",
            "User-Agent": "Dart/3.0 (dart:io)",
            "Accept": "application/json",
            "Content-Type": "application/json"
        }
        try:
            response = await self.session.get(url, headers=headers)
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as e:
            logger.error(f"Failed to get account info: {e.response.status_code}")
            raise Exception(f"Failed to get account info: {e.response.status_code}")
        except Exception as e:
            logger.error(f"Account info request failed: {str(e)}")
            raise

    async def check_nd_fact(self, nd: str) -> dict:
        url = f"{self.base_url}/epay/checkNdFact"
        payload = {"nd": nd, "nfact": "", "service": "Dus"}
        headers = {
            "Content-Type": "application/json; charset=utf-8",
            "User-Agent": "Dart/3.0 (dart:io)",
            "Accept-Encoding": "gzip"
        }
        try:
            response = await self.session.post(url, json=payload, headers=headers)
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as e:
            logger.error(f"Failed to check ND Fact: {e.response.status_code}")
            raise Exception(f"Failed to check ND Fact: {e.response.status_code}")
        except Exception as e:
            logger.error(f"Check ND Fact request failed: {str(e)}")
            raise

    async def check_nd_lte(self, nd: str) -> dict:
        url = f"{self.base_url}/epay/checkNdLte"
        payload = {"nd": nd}
        headers = {
            "Content-Type": "application/json; charset=utf-8",
            "User-Agent": "Dart/3.0 (dart:io)",
            "Accept-Encoding": "gzip"
        }
        try:
            response = await self.session.post(url, json=payload, headers=headers)
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as e:
            logger.error(f"Failed to check ND LTE: {e.response.status_code}")
            raise Exception(f"Failed to check ND LTE: {e.response.status_code}")
        except Exception as e:
            logger.error(f"Check ND LTE request failed: {str(e)}")
            raise

    async def use_voucher_lte(self, nd: str, ncli: str, voucher: str, type1: str, ip: str = "0.0.0.0") -> dict:
        url = f"{self.base_url}/epay/voucherLte"
        payload = {"nd": nd, "ncli": ncli, "type": type1, "voucher": voucher, "ip": ip}
        headers = {
            "Content-Type": "application/json; charset=utf-8",
            "User-Agent": "Dart/3.0 (dart:io)",
            "Accept-Encoding": "gzip"
        }
        try:
            response = await self.session.post(url, json=payload, headers=headers)
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as e:
            logger.error(f"Failed to use LTE voucher: {e.response.status_code}")
            raise Exception(f"Failed to use LTE voucher: {e.response.status_code}")
        except Exception as e:
            logger.error(f"Use LTE voucher request failed: {str(e)}")
            raise

    async def use_voucher(self, nd: str, ncli: str, voucher: str, ip: str = "0.0.0.0") -> dict:
        url = f"{self.base_url}/epay/voucherAdsl"
        payload = {"nd": nd, "ncli": ncli, "type": "FTTH", "voucher": voucher, "ip": ip}
        headers = {
            "Content-Type": "application/json; charset=utf-8",
            "User-Agent": "Dart/3.0 (dart:io)",
            "Accept-Encoding": "gzip"
        }
        try:
            response = await self.session.post(url, json=payload, headers=headers)
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as e:
            logger.error(f"Failed to use voucher: {e.response.status_code}")
            raise Exception(f"Failed to use voucher: {e.response.status_code}")
        except Exception as e:
            logger.error(f"Use voucher request failed: {str(e)}")
            raise

    async def retrieve_ncli(self, phone_number: str) -> dict:
        """
        Retrieves NCLI for ADSL/FTTH lines using the correct endpoint.
        """
        paiement_url = f"{self.paiement_url}/internet_recharge.php"
        payload = f"validerADSLco20=Confirmer&ndco20={phone_number}&"
        headers = {
            "Authorization": "Basic VEdkNzJyOTozUjcjd2FiRHNfSGpDNzg3IQ==",
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            "User-Agent": "Dalvik/2.1.0 (Linux; U; Android 10; M2004J19C MIUI/V12.0.4.0.QJCMIXM)",
            "Host": "paiement.algerietelecom.dz",
            "Connection": "Keep-Alive",
            "Accept-Encoding": "gzip",
        }
        try:
            response = await self.session.post(paiement_url, data=payload, headers=headers)
            response.raise_for_status()
            # The response is JSON, sometimes prefixed with BOM characters
            text_response = await response.text
            clean_text = text_response.lstrip('\ufeff').strip()
            return json.loads(clean_text)
        except json.JSONDecodeError as e:
            logger.error(f"Failed to decode JSON from retrieve_ncli: {e}")
            return {"succes": "0", "error": "Invalid JSON response from server."}
        except httpx.HTTPStatusError as e:
            logger.error(f"Failed to retrieve NCLI: {e.response.status_code}")
            raise Exception(f"Failed to retrieve NCLI: {e.response.status_code}")
        except Exception as e:
            logger.error(f"Retrieve NCLI request failed: {str(e)}")
            raise

    async def retrieve_ncli_4glte(self, phone_number: str) -> dict:
        paiement_url = f"{self.paiement_url}/voucher_internet.php"
        payload = f"dahabiaco20=Confirmer&nd_4gco20={phone_number}&"
        headers = {
            "Authorization": "Basic VEdkNzJyOTozUjcjd2FiRHNfSGpDNzg3IQ==",
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            "User-Agent": "Dalvik/2.1.0 (Linux; U; Android 10; M2004J19C MIUI/V12.0.4.0.QJCMIXM)",
            "Host": "paiement.algerietelecom.dz",
            "Connection": "Keep-Alive",
            "Accept-Encoding": "gzip",
        }
        try:
            response = await self.session.post(paiement_url, data=payload, headers=headers)
            response.raise_for_status()
            text_response = await response.text
            clean_text = text_response.lstrip('\ufeff').strip()
            return json.loads(clean_text)
        except json.JSONDecodeError:
            return {
                "succes": "0",
                "error": "Invalid JSON returned by server",
                "response_text": text_response.strip()
            }
        except httpx.HTTPStatusError as e:
            logger.error(f"Failed to retrieve 4G LTE NCLI: {e.response.status_code}")
            raise Exception(f"Failed to retrieve 4G LTE NCLI: {e.response.status_code}")
        except Exception as e:
            logger.error(f"Retrieve 4G LTE NCLI request failed: {str(e)}")
            raise
