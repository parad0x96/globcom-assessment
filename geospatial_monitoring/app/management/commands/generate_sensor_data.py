# your_app/management/commands/generate_sensor_data.py
import random
import json
import asyncio
from django.core.management.base import BaseCommand
from app.models import SensorData, SensorDataType
from django.utils import timezone
from channels.db import database_sync_to_async
import websockets

class Command(BaseCommand):
    help = 'Generate dummy sensor data and send to WebSocket'

    async def send_to_websocket(self, data, websocket):
        await websocket.send(json.dumps(data))
        print(f"Sent to WebSocket: {data}")

    async def generate_and_send_data(self, websocket):
        for i in range(100):
            sensor_data = {
                'value': random.uniform(0, 100),
                'type': "temperature",
                'timestamp': timezone.now().isoformat(),
                'latitude': random.uniform(-30, 30),
                'longitude': random.uniform(-30, 30),
                'sensor_id': str(random.randint(0, 10))
            }
            await self.create_sensor_data(sensor_data)
            await self.send_to_websocket(sensor_data, websocket)
            await asyncio.sleep(3)

    @database_sync_to_async
    def create_sensor_data(self, sensor_data):
        return SensorData.objects.create(**sensor_data)
    
    async def connect_to_websocket(self):
        uri = "ws://127.0.0.1:8000/ws/sensor-data/"
        websocket = await websockets.connect(uri)
        print("Connected to WebSocket")
        return websocket

    def handle(self, *args, **kwargs):
        asyncio.get_event_loop().run_until_complete(self.run())

    async def run(self):
        websocket = await self.connect_to_websocket()
        await self.generate_and_send_data(websocket)
        await websocket.close()
