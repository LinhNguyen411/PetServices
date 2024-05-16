from rest_framework.viewsets import ModelViewSet
from django_filters.rest_framework import DjangoFilterBackend

from .models import Service, ServicePrice
from .serializers import ServiceSerializer, ServicePriceSerializer


class ServiceViewSet(ModelViewSet):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['species']

class ServicePriceViewSet(ModelViewSet):
    queryset = ServicePrice.objects.all()
    serializer_class = ServicePriceSerializer