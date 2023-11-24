from django.db import models

# Create your models here.
class SensorData(models.Model):
    sensor_id = models.CharField(help_text="The sensor ID", max_length=255, null=True)
    pressure = models.FloatField()
    steam_injection = models.FloatField()
    temperature = models.FloatField()
    timestamp = models.DateTimeField(auto_now_add=True)
    latitude = models.FloatField()
    longitude = models.FloatField()