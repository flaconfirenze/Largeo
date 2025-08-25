from backend.main import app
from mangum import Mangum

# `lifespan="off"` is recommended for serverless environments like Cloudflare Workers
# as the startup/shutdown events of FastAPI might not work as expected.
handler = Mangum(app, lifespan="off")
