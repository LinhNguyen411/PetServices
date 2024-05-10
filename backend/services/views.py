from django.views.decorators.csrf import csrf_exempt
from django.http.response import JsonResponse

from rest_framework.parsers import JSONParser
from rest_framework import status

from .models import Service, ServicePrice
from .serializers import ServiceSerializer, ServicePriceSerializer

@csrf_exempt
def serviceApi(request, id = 0):
    if request.method == 'GET':
        services = Service.objects.all()
        services_serializer = ServiceSerializer(services, many = True)
        return JsonResponse(services_serializer.data, safe = False)
    elif request.method == 'POST':
        service_data = JSONParser().parse(request)
        service_serializer = ServiceSerializer(data = service_data)
        if service_serializer.is_valid():
            service_serializer.save()
            return JsonResponse('Added Successfully!', safe=False, status=status.HTTP_201_CREATED)
        return JsonResponse('Failed to Add!', safe=False,status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'PUT':
        service_data = JSONParser().parse(request)
        service = Service.objects.get(id = service_data['id'])
        service_serializer = ServiceSerializer(service, data=service_data)
        if service_serializer.is_valid():
            service_serializer.save()
            return JsonResponse('Updated Successfully!', safe=False, status=status.HTTP_200_OK)
        return JsonResponse('Failed to Updated!', safe=False,status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        service = Service.objects.get(id = id)
        service.delete()
        return JsonResponse('Deleted Successfully!', safe=False, status=status.HTTP_204_NO_CONTENT)
    
@csrf_exempt
def servicePriceApi(request, id = 0):
    if request.method == 'GET':
        servicePrices = ServicePrice.objects.all()
        servicePrices_serializer = ServicePriceSerializer(servicePrices, many = True)
        return JsonResponse(servicePrices_serializer.data, safe = False)
    elif request.method == 'POST':
        servicePrice_data = JSONParser().parse(request)
        servicePrice_serializer = ServicePriceSerializer(data = servicePrice_data)
        if servicePrice_serializer.is_valid():
            servicePrice_serializer.save()
            return JsonResponse('Added Successfully!', safe=False, status=status.HTTP_201_CREATED)
        return JsonResponse('Failed to Add!', safe=False,status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'PUT':
        servicePrice_data = JSONParser().parse(request)
        servicePrice = ServicePrice.objects.get(id = servicePrice_data['id'])
        servicePrice_serializer = ServicePriceSerializer(servicePrice, data=servicePrice_data)
        if servicePrice_serializer.is_valid():
            servicePrice_serializer.save()
            return JsonResponse('Updated Successfully!', safe=False, status=status.HTTP_200_OK)
        return JsonResponse('Failed to Updated!', safe=False,status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        servicePrice = ServicePrice.objects.get(id = id)
        servicePrice.delete()
        return JsonResponse('Deleted Successfully!', safe=False, status=status.HTTP_204_NO_CONTENT)