from fastapi import FastAPI

app = FastAPI(
    title="Digital Memory Assistant",
    version="0.1.0"
)

@app.get("/")
async def root():
    return {
        "status": "running",
        "project": "Digital Memory Assistant"
    }