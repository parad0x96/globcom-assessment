from django.shortcuts import render
from django.utils import timezone
from django.utils.timezone import timedelta
from django.http.response import JsonResponse
from django.forms.models import model_to_dict
from django.contrib.auth.decorators import login_required
from app.models import SensorData

@login_required(login_url="/login/")
def heatmap_view(request):
    return render(
        request, "heatmap.html", {"websocket_url": "ws://127.0.0.1/ws/realtime-data/"}
    )

@login_required(login_url="/login/")
def get_sensor_data(request):
    queryset = SensorData.objects.filter(timestamp__gte=timezone.now() - timedelta(days=7))
    dict_list = []
    if queryset:
        dict_list = [model_to_dict(instance) for instance in queryset]
    return JsonResponse(data=dict_list, safe=False)