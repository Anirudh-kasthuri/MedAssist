# app/api/rate_limit.py
from fastapi import HTTPException, status
from typing import Callable
import traceback

# Try to import the project's redis client (if present)
try:
    from app.core.redis import redis_client
    _have_redis = True
except Exception:
    redis_client = None
    _have_redis = False


def rate_limiter(name: str, limit: int = 60, window_seconds: int = 60) -> Callable:
    """
    Returns a dependency callable that increments a redis counter keyed by name.
    If Redis is unavailable, this is a safe no-op (it will allow requests).
    """
    key = f"rate:{name}"

    def dependency():
        # If no redis client available, allow the request (log for visibility).
        if not _have_redis or redis_client is None:
            # Optional: print a short message so you can see in logs
            print(f"[rate_limiter] Redis not available; skipping limiting for '{name}'")
            return None

        try:
            # INCR the key
            current = redis_client.incr(key)
            # if this is first increment, set expiry
            if current == 1:
                try:
                    redis_client.expire(key, window_seconds)
                except Exception:
                    # best-effort set expiry; ignore expiry failures
                    pass

            if current > limit:
                raise HTTPException(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail="Too many requests, please slow down."
                )
            return None
        except Exception as e:
            # If Redis fails at runtime, **do not crash** the request flow.
            print(f"[rate_limiter] Redis error: {e}. Allowing request for '{name}'.")
            traceback.print_exc()
            return None

    return dependency
