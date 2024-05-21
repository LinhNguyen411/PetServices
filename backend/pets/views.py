from rest_framework.viewsets import ModelViewSet

from .models import Pet, Species, Weight
from .serializers import PetSerializer, SpeciesSerializer, WeightSerializer
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter,OrderingFilter

# Create your views here.
class PetViewSet(ModelViewSet):
    queryset = Pet.objects.all()
    serializer_class = PetSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['species', 'weight']
    search_fields = ['name']

class SpeciesViewSet(ModelViewSet):
    queryset = Species.objects.all()
    serializer_class = SpeciesSerializer
    filter_backends = [SearchFilter]
    search_fields = ['name']
    

class WeightViewSet(ModelViewSet):
    queryset = Weight.objects.all()
    serializer_class = WeightSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['species']
