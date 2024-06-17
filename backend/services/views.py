from rest_framework.viewsets import ModelViewSet
from django_filters.rest_framework import DjangoFilterBackend

from rest_framework.filters import SearchFilter, OrderingFilter
from .models import Service
from .serializers import ServiceSerializer
from rest_framework.pagination import PageNumberPagination



class ServiceViewSet(ModelViewSet):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    pagination_class = PageNumberPagination
    search_fields = ['id', 'name', 'description']
    ordering_fields = ['name', 'price']
    filterset_fields = ['species', 'is_one_day']

