from django.db import models

# Create your models here.

class SensorDataType(models.TextChoices):
    temperature = ("temperature", "Temperature")
    pressure = ("pressure", "Pressure")
    steam_injection = ("steam_injection", "Steam Injection")

class SensorData(models.Model):
    sensor_id = models.CharField(help_text="The sensor ID", max_length=255, null=True)
    value = models.FloatField()
    type = models.CharField(choices=SensorDataType.choices, max_length=20)
    timestamp = models.DateTimeField(auto_now_add=True)
    latitude = models.FloatField()
    longitude = models.FloatField()