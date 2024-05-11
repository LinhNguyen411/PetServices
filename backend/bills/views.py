from django.views.decorators.csrf import csrf_exempt
from django.http.response import JsonResponse

from rest_framework.parsers import JSONParser
from rest_framework import status

from .models import Bill, BillProductItem, BillServiceItem
from .serializers import BillSerializer, BillProductItemSerializer, BillServiceItemSerializer

@csrf_exempt
def billApi(request, id = 0):
    if request.method == 'GET':
        bills = Bill.objects.all()
        bills_serializer = BillSerializer(bills, many = True)
        return JsonResponse(bills_serializer.data, safe = False)
    elif request.method == 'POST':
        bill_data = JSONParser().parse(request)
        bill_serializer = BillSerializer(data = bill_data)
        if bill_serializer.is_valid():
            bill_serializer.save()
            return JsonResponse('Added Successfully!', safe=False, status=status.HTTP_201_CREATED)
        return JsonResponse('Failed to Add!', safe=False,status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'PUT':
        bill_data = JSONParser().parse(request)
        bill = Bill.objects.get(id = bill_data['id'])
        bill_serializer = BillSerializer(bill, data=bill_data)
        if bill_serializer.is_valid():
            bill_serializer.save()
            return JsonResponse('Updated Successfully!', safe=False, status=status.HTTP_200_OK)
        return JsonResponse('Failed to Updated!', safe=False,status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        bill = Bill.objects.get(id = id)
        bill.delete()
        return JsonResponse('Deleted Successfully!', safe=False, status=status.HTTP_204_NO_CONTENT)


@csrf_exempt
def billProductItemApi(request, id = 0):
    if request.method == 'GET':
        billProductItems = BillProductItem.objects.all()
        billProductItems_serializer = BillProductItemSerializer(billProductItems, many = True)
        return JsonResponse(billProductItems_serializer.data, safe = False)
    elif request.method == 'POST':
        billProductItem_data = JSONParser().parse(request)
        billProductItem_serializer = BillProductItemSerializer(data = billProductItem_data)
        if billProductItem_serializer.is_valid():
            billProductItem_serializer.save()
            return JsonResponse('Added Successfully!', safe=False, status=status.HTTP_201_CREATED)
        return JsonResponse('Failed to Add!', safe=False,status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'PUT':
        billProductItem_data = JSONParser().parse(request)
        billProductItem = BillProductItem.objects.get(id = billProductItem_data['id'])
        billProductItem_serializer = BillProductItemSerializer(billProductItem, data=billProductItem_data)
        if billProductItem_serializer.is_valid():
            billProductItem_serializer.save()
            return JsonResponse('Updated Successfully!', safe=False, status=status.HTTP_200_OK)
        return JsonResponse('Failed to Updated!', safe=False,status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        billProductItem = BillProductItem.objects.get(id = id)
        billProductItem.delete()
        return JsonResponse('Deleted Successfully!', safe=False, status=status.HTTP_204_NO_CONTENT)
    
@csrf_exempt
def billServiceItemApi(request, id = 0):
    if request.method == 'GET':
        billServiceItems = BillServiceItem.objects.all()
        billServiceItems_serializer = BillServiceItemSerializer(billServiceItems, many = True)
        return JsonResponse(billServiceItems_serializer.data, safe = False)
    elif request.method == 'POST':
        billServiceItem_data = JSONParser().parse(request)
        billServiceItem_serializer = BillServiceItemSerializer(data = billServiceItem_data)
        if billServiceItem_serializer.is_valid():
            billServiceItem_serializer.save()
            return JsonResponse('Added Successfully!', safe=False, status=status.HTTP_201_CREATED)
        return JsonResponse('Failed to Add!', safe=False,status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'PUT':
        billServiceItem_data = JSONParser().parse(request)
        billServiceItem = BillServiceItem.objects.get(id = billServiceItem_data['id'])
        billServiceItem_serializer = BillServiceItemSerializer(billServiceItem, data=billServiceItem_data)
        if billServiceItem_serializer.is_valid():
            billServiceItem_serializer.save()
            return JsonResponse('Updated Successfully!', safe=False, status=status.HTTP_200_OK)
        return JsonResponse('Failed to Updated!', safe=False,status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        billServiceItem = BillServiceItem.objects.get(id = id)
        billServiceItem.delete()
        return JsonResponse('Deleted Successfully!', safe=False, status=status.HTTP_204_NO_CONTENT)