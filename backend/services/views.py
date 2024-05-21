from rest_framework.viewsets import ModelViewSet
from django_filters.rest_framework import DjangoFilterBackend

from .models import Service, ServiceSurchanges
from .serializers import ServiceSerializer


class ServiceViewSet(ModelViewSet):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['species']

class ServiceSurchangesViewSet(ModelViewSet):
    queryset = ServiceSurchanges.objects.all()
    serializer_class = ServiceSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['service', 'weight']