from fastapi import Depends, HTTPException, status
from app.api.dependencies import get_current_user
from app.core.redis import redis_client

RATE_LIMIT = 5        # requests
WINDOW_SECONDS = 60   # per minute


def rate_limiter(endpoint: str):
    def dependency(user=Depends(get_current_user)):
        key = f"rate:{user.id}:{endpoint}"

        current = redis_client.incr(key)

        if current == 1:
            redis_client.expire(key, WINDOW_SECONDS)

        if current > RATE_LIMIT:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Too many requests. Try again later."
            )

        return True

    return dependency
