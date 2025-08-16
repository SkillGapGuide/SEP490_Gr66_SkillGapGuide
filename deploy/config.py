import os
import yaml
import asyncio

ROOT_PATH = os.path.dirname(__file__)
class Config:
    
    def __init__(self):
        self.config = self.load_config()
        data = self.config
        self.REPO_PATH: str = data.get("REPO_PATH", "/opt/SEP490_Gr66_SkillGapGuide")
        self.BRANCH: str = data.get("BRANCH", "dev")
        self.WEBHOOK_SECRET: str = data.get("WEBHOOK_SECRET", "CHANGE_ME")
        self.API_HOST: str = data.get("API_HOST", "0.0.0.0")
        self.API_PORT: int = data.get("API_PORT", 6969)
        self.LOCK: asyncio.Lock = asyncio.Lock()

    def load_config(self) -> dict:
        config_path = os.path.join(ROOT_PATH, "env.yaml")
        if os.path.exists(config_path):
            with open(config_path, "r") as r_file:
                return yaml.safe_load(r_file)
        else:
            return dict()