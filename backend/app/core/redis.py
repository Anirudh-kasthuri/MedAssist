import redis
<<<<<<< HEAD

redis_client = redis.Redis(
    host="127.0.0.1",
    port=6379,
    db=0,
    decode_responses=True
)
=======
from app.core.config import REDIS_URL

redis_client = redis.Redis.from_url(REDIS_URL, decode_responses=True)
>>>>>>> 8b085f157b0fac3206da4a91af4440639604e366
