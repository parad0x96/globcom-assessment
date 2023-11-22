from django.db import models

# Create your models here.
class SensorData(models.Model):
    pressure = models.FloatField()
    steam_injection = models.FloatField()
    temperature = models.FloatField()
    timestamp = models.DateTimeField(auto_now_add=True)