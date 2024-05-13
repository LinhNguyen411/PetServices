from rest_framework.viewsets import ModelViewSet

from .models import Service, ServicePrice
from .serializers import ServiceSerializer, ServicePriceSerializer

class ServiceViewSet(ModelViewSet):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer

class ServicePriceViewSet(ModelViewSet):
    queryset = ServicePrice.objects.all()
    serializer_class = ServicePriceSerializer