from pathlib import Path
from app.config.settings import APP_BASE_DIR, settings


# ===============Ageng相关的配置文件===========
AGENT_CONFIG_DIR = APP_BASE_DIR / ".agents"
AGENT_CONTEXT_DIR = AGENT_CONFIG_DIR / "prompts"
AGENT_CONTEXT_FILES = ["AGENT.md", "SOUL.md", "USER.md", "TOOLS.md", "IDENTITY.md", "RUNTIME.md"]
AGENT_META_FILE = "meta.json"
AGENT_MCP_SERVERS_FILE = "mcp_servers.json"
AGENT_USABLE_TOOLS_FILE = "usable_tools.json"
AGENT_USABLE_SKILLS_FILE = "usable_skills.json"


# ===============运行时数据目录===========
AGENTS_RUNTIME_DATA_DIR = Path(settings.runtime_data_dir) / ".agent"
WORKSPACE_RUNTIME_DATA_DIR = Path(settings.runtime_data_dir) / ".workspace"
USER_RUNTIME_DATA_DIR = Path(settings.runtime_data_dir) / ".users"
