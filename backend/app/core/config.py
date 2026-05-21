from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DB_HOST: str = "localhost"
    DB_PORT: int = 5432
    DB_NAME: str = "test1"
    DB_USER: str = "postgres"
    DB_PASSWORD: str = "admin"
    DB_SSL_MODE: str = "disable"

    SECRET_KEY: str = "change-me-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    @property
    def DATABASE_URL(self) -> str:
        ssl_param = ""
        if self.DB_SSL_MODE == "require":
            ssl_param = "?ssl=require"
        elif self.DB_SSL_MODE == "prefer":
            ssl_param = "?ssl=prefer"
        return f"postgresql+asyncpg://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}{ssl_param}"

    @property
    def ASYNC_DATABASE_URL(self) -> str:
        return self.DATABASE_URL

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
