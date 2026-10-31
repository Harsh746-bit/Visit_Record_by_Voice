import logging
from typing import Dict, List
from fastapi import WebSocket

logger = logging.getLogger(__name__)

class WebSocketConnectionManager:
    """
    Manages real-time WebSocket connections for ANM circles and ASHA workers.
    Enables instant field-to-supervisor alerts (visit.submitted, high_risk.alert, record.reviewed).
    """
    def __init__(self):
        self.anm_connections: Dict[str, List[WebSocket]] = {}
        self.asha_connections: Dict[str, List[WebSocket]] = {}

    async def connect_anm(self, circle_id: str, websocket: WebSocket):
        await websocket.accept()
        if circle_id not in self.anm_connections:
            self.anm_connections[circle_id] = []
        self.anm_connections[circle_id].append(websocket)
        logger.info(f"WebSocket: ANM connected to circle '{circle_id}'. Total: {len(self.anm_connections[circle_id])}")

    def disconnect_anm(self, circle_id: str, websocket: WebSocket):
        if circle_id in self.anm_connections and websocket in self.anm_connections[circle_id]:
            self.anm_connections[circle_id].remove(websocket)
            logger.info(f"WebSocket: ANM disconnected from circle '{circle_id}'.")

    async def connect_asha(self, worker_id: str, websocket: WebSocket):
        await websocket.accept()
        if worker_id not in self.asha_connections:
            self.asha_connections[worker_id] = []
        self.asha_connections[worker_id].append(websocket)
        logger.info(f"WebSocket: ASHA worker '{worker_id}' connected.")

    def disconnect_asha(self, worker_id: str, websocket: WebSocket):
        if worker_id in self.asha_connections and websocket in self.asha_connections[worker_id]:
            self.asha_connections[worker_id].remove(websocket)
            logger.info(f"WebSocket: ASHA worker '{worker_id}' disconnected.")

    async def broadcast_to_circle(self, circle_id: str, event_type: str, data: dict):
        """Dispatches event to all active ANM supervisors in the circle."""
        payload = {"event": event_type, "data": data}
        targets = self.anm_connections.get(circle_id, []) + self.anm_connections.get("all", [])
        for ws in targets:
            try:
                await ws.send_json(payload)
            except Exception as e:
                logger.warning(f"Failed to deliver WebSocket message to ANM: {e}")

    async def send_to_worker(self, worker_id: str, event_type: str, data: dict):
        """Dispatches event directly to a specific ASHA frontline worker."""
        payload = {"event": event_type, "data": data}
        targets = self.asha_connections.get(worker_id, [])
        for ws in targets:
            try:
                await ws.send_json(payload)
            except Exception as e:
                logger.warning(f"Failed to deliver WebSocket message to ASHA {worker_id}: {e}")

ws_manager = WebSocketConnectionManager()
