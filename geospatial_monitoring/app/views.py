from django.shortcuts import render

def heatmap_view(request):
    return render(request, 'heatmap.html', {'websocket_url': 'ws://127.0.0.1/ws/realtime-data/'})