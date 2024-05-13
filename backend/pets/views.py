from rest_framework.viewsets import ModelViewSet

from .models import Pet, Species, Weight
from .serializers import PetSerializer, SpeciesSerializer, WeightSerializer

# Create your views here.
class PetViewSet(ModelViewSet):
    queryset = Pet.objects.all()
    serializer_class = PetSerializer

class SpeciesViewSet(ModelViewSet):
    queryset = Species.objects.all()
    serializer_class = SpeciesSerializer

class WeightViewSet(ModelViewSet):
    queryset = Weight.objects.all()
    serializer_class = WeightSerializer