from dataclasses import dataclass
from typing import Any

import httpx
import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jwt import PyJWKClient

from app.core.config import Settings, get_settings

bearer = HTTPBearer(auto_error=False)


@dataclass(frozen=True)
class Principal:
    subject: str
    email: str | None


class ClerkVerifier:
    def __init__(self, settings: Settings) -> None:
        self.settings = settings
        self.jwks_client = PyJWKClient(str(settings.clerk_jwks_url))

    def verify(self, token: str) -> Principal:
        try:
            signing_key = self.jwks_client.get_signing_key_from_jwt(token)
            payload: dict[str, Any] = jwt.decode(
                token,
                signing_key.key,
                algorithms=["RS256"],
                issuer=str(self.settings.clerk_issuer),
                options={"verify_aud": False},
            )
        except (jwt.PyJWTError, httpx.HTTPError) as exc:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication token",
            ) from exc

        subject = payload.get("sub")
        if not isinstance(subject, str) or not subject:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing subject")

        email = payload.get("email")
        return Principal(subject=subject, email=email if isinstance(email, str) else None)


def get_verifier(settings: Settings = Depends(get_settings)) -> ClerkVerifier:
    return ClerkVerifier(settings)


async def get_principal(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer),
    verifier: ClerkVerifier = Depends(get_verifier),
) -> Principal:
    if credentials is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing bearer token")
    return verifier.verify(credentials.credentials)
