from django.views.decorators.csrf import csrf_exempt
from django.http.response import JsonResponse

from rest_framework.parsers import JSONParser
from rest_framework import status

from .models import Customer
from .serializers import CustomerSerializer

# Create your views here.
@csrf_exempt
def customerApi(request, id = 0):
    if request.method == 'GET':
        customers = Customer.objects.all()
        customers_serializer = CustomerSerializer(customers, many = True)
        return JsonResponse(customers_serializer.data, safe = False)
    elif request.method == 'POST':
        customer_data = JSONParser().parse(request)
        customer_serializer = CustomerSerializer(data = customer_data)
        if customer_serializer.is_valid():
            customer_serializer.save()
            return JsonResponse('Added Successfully!', safe=False, status=status.HTTP_201_CREATED)
        return JsonResponse('Failed to Add!', safe=False,status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'PUT':
        customer_data = JSONParser().parse(request)
        customer = Customer.objects.get(id = customer_data['id'])
        customer_serializer = CustomerSerializer(customer, data=customer_data)
        if customer_serializer.is_valid():
            customer_serializer.save()
            return JsonResponse('Updated Successfully!', safe=False, status=status.HTTP_200_OK)
        return JsonResponse('Failed to Updated!', safe=False,status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        customer = Customer.objects.get(id = id)
        customer.delete()
        return JsonResponse('Deleted Successfully!', safe=False, status=status.HTTP_204_NO_CONTENT)