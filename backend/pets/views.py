from rest_framework.viewsets import ModelViewSet
from .models import Pet, Species
from .serializers import PetSerializer, SpeciesSerializer
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter,OrderingFilter
from rest_framework.pagination import PageNumberPagination

from rest_framework.permissions import IsAuthenticated
from accounts.permissions import IsManager, IsEmployee

# Create your views here.
class PetViewSet(ModelViewSet):
    queryset = Pet.objects.all()
    serializer_class = PetSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter,OrderingFilter]
    pagination_class = PageNumberPagination
    filterset_fields = ['species','owner']
    search_fields = ['name']
    ordering_fields = ['name','age']


class SpeciesViewSet(ModelViewSet):
    queryset = Species.objects.all()
    serializer_class = SpeciesSerializer
    filter_backends = [OrderingFilter]
    pagination_class = PageNumberPagination
    ordering_fields = ['name']
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [IsAuthenticated, IsManager]
        return [permission() for permission in permission_classes]
