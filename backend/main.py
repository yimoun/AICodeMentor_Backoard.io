from fastapi import FastAPI

from fastapi.middleware.cors import CORSMiddleware

from contextlib import asynccontextmanager


from app.config.database import engine

from app.routers import auth, profile



@asynccontextmanager

async def lifespan(app: FastAPI):

    # Startup: Create tables

    #await create_all_tables()
    print("Base de données connectée")

    yield

    # Shutdown: Cleanup

    await engine.dispose()



app = FastAPI(

    title="AI Code Mentor API",

    version="1.0.0",

    lifespan=lifespan

)


# CORS Configuration

app.add_middleware(

    CORSMiddleware,

    allow_origins=["http://front:3000"],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],

)


# Include Routers

app.include_router(auth.router)

app.include_router(profile.router)

#app.include_router(courses.router, prefix="/api/courses", tags=["Courses"])

#app.include_router(progress.router, prefix="/api/progress", tags=["Progress"])

#app.include_router(chat.router, prefix="/api/chat", tags=["AI Chat"])



@app.get("/")

async def root():

    return {"message": "AI Code Mentor API", "status": "running"}