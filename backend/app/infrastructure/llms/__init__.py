"""
LLM模型模块
提供各类模型工厂和模型实现
"""
from .chat_models.base import LLM
from .computervision_models.base import BaseComputerVision
from .text2speech_models.base import BaseTTS
from .speech2text_models.base import BaseSTT


# 各模型工厂实例
from .chat_models.factory import llm_factory
from .computervision_models.factory import cv_factory
from .text2speech_models.factory import tts_factory
from .speech2text_models.factory import stt_factory


__all__ = [
    # 基础类型
    "LLM",
    "BaseComputerVision",
    "BaseTTS",
    "BaseSTT",

    # 工厂实例
    "llm_factory",
    "cv_factory", 
    "tts_factory",
    "stt_factory"
]