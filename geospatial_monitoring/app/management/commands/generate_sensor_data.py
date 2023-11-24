# your_app/management/commands/generate_sensor_data.py
import random
from random import randint
import json
import asyncio
from django.core.management.base import BaseCommand
from app.models import SensorData
from django.utils import timezone
import websockets
from time import sleep

class Command(BaseCommand):
    help = 'Generate dummy sensor data and send to WebSocket'

    async def send_to_websocket(self, data):
        uri = "ws://127.0.0.1:8000/ws/sensor-data/"  
        async with websockets.connect(uri) as websocket:
            await websocket.send(json.dumps(data))
            print(f"Sent to WebSocket: {data}")

    def handle(self, *args, **kwargs):
        for i in range(100):
            sensor_data = {
                'pressure': random.uniform(900, 1100),
                'steam_injection': random.uniform(0, 100),
                'temperature': random.uniform(20, 30),
                'timestamp': timezone.now().isoformat(),
                'latitude': random.uniform(-90, 90),
                'longitude': random.uniform(-180, 180),
                'sensor_id': randint(0,10)
            }

            # SensorData.objects.create(**sensor_data)
            asyncio.run(self.send_to_websocket(sensor_data))
            sleep(3)

        self.stdout.write(self.style.SUCCESS('Dummy data created and sent to WebSocket successfully'))
