from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    anthropic_api_key: str = ""
    github_token: str = ""
    model_name: str = "claude-opus-4-6"
    max_content_size: int = 15000
    max_file_size: int = 8000

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


settings = Settings()
