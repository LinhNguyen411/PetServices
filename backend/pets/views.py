from rest_framework.viewsets import ModelViewSet
from .models import Pet, Species
from .serializers import PetSerializer, SpeciesSerializer
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter,OrderingFilter
from rest_framework.pagination import PageNumberPagination


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
    
