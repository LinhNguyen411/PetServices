from django.views.decorators.csrf import csrf_exempt
from django.http.response import JsonResponse

from rest_framework.parsers import JSONParser
from rest_framework import status

from .models import Pet, Species, Weight
from .serializers import PetSerializer, SpeciesSerializer, WeightSerializer

# Create your views here.
@csrf_exempt
def petApi(request, id = 0):
    if request.method == 'GET':
        pets = Pet.objects.all()
        pets_serializer = PetSerializer(pets, many = True)
        return JsonResponse(pets_serializer.data, safe = False)
    elif request.method == 'POST':
        pet_data = JSONParser().parse(request)
        pet_serializer = PetSerializer(data = pet_data)
        if pet_serializer.is_valid():
            pet_serializer.save()
            return JsonResponse('Added Successfully!', safe=False, status=status.HTTP_201_CREATED)
        return JsonResponse('Failed to Add!', safe=False,status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'PUT':
        pet_data = JSONParser().parse(request)
        pet = Pet.objects.get(id = pet_data['id'])
        pet_serializer = PetSerializer(pet, data=pet_data)
        if pet_serializer.is_valid():
            pet_serializer.save()
            return JsonResponse('Updated Successfully!', safe=False, status=status.HTTP_200_OK)
        return JsonResponse('Failed to Updated!', safe=False,status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        pet = Pet.objects.get(id = id)
        pet.delete()
        return JsonResponse('Deleted Successfully!', safe=False, status=status.HTTP_204_NO_CONTENT)
    
@csrf_exempt
def speciesApi(request, id = 0):
    if request.method == 'GET':
        speciess = Species.objects.all()
        speciess_serializer = SpeciesSerializer(speciess, many = True)
        return JsonResponse(speciess_serializer.data, safe = False)
    elif request.method == 'POST':
        species_data = JSONParser().parse(request)
        species_serializer = SpeciesSerializer(data = species_data)
        if species_serializer.is_valid():
            species_serializer.save()
            return JsonResponse('Added Successfully!', safe=False, status=status.HTTP_201_CREATED)
        return JsonResponse('Failed to Add!', safe=False,status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'PUT':
        species_data = JSONParser().parse(request)
        species = Species.objects.get(id = species_data['id'])
        species_serializer = SpeciesSerializer(species, data=species_data)
        if species_serializer.is_valid():
            species_serializer.save()
            return JsonResponse('Updated Successfully!', safe=False, status=status.HTTP_200_OK)
        return JsonResponse('Failed to Updated!', safe=False,status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        species = Species.objects.get(id = id)
        species.delete()
        return JsonResponse('Deleted Successfully!', safe=False, status=status.HTTP_204_NO_CONTENT)


@csrf_exempt
def weightApi(request, id = 0):
    if request.method == 'GET':
        weights = Weight.objects.all()
        weights_serializer = WeightSerializer(weights, many = True)
        return JsonResponse(weights_serializer.data, safe = False)
    elif request.method == 'POST':
        weight_data = JSONParser().parse(request)
        weight_serializer = WeightSerializer(data = weight_data)
        if weight_serializer.is_valid():
            weight_serializer.save()
            return JsonResponse('Added Successfully!', safe=False, status=status.HTTP_201_CREATED)
        return JsonResponse('Failed to Add!', safe=False,status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'PUT':
        weight_data = JSONParser().parse(request)
        weight = Weight.objects.get(id = weight_data['id'])
        weight_serializer = WeightSerializer(weight, data=weight_data)
        if weight_serializer.is_valid():
            weight_serializer.save()
            return JsonResponse('Updated Successfully!', safe=False, status=status.HTTP_200_OK)
        return JsonResponse('Failed to Updated!', safe=False,status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        weight = Weight.objects.get(id = id)
        weight.delete()
        return JsonResponse('Deleted Successfully!', safe=False, status=status.HTTP_204_NO_CONTENT)