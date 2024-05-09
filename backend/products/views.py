from django.views.decorators.csrf import csrf_exempt
from django.http.response import JsonResponse

from rest_framework.parsers import JSONParser
from rest_framework import status

from .models import Product, Category
from .serializers import ProductSerializer, CategorySerializer

@csrf_exempt
def productApi(request, id = 0):
    if request.method == 'GET':
        products = Product.objects.all()
        products_serializer = ProductSerializer(products, many = True)
        return JsonResponse(products_serializer.data, safe = False)
    elif request.method == 'POST':
        product_data = JSONParser().parse(request)
        product_serializer = ProductSerializer(data = product_data)
        if product_serializer.is_valid():
            product_serializer.save()
            return JsonResponse('Added Successfully!', safe=False, status=status.HTTP_201_CREATED)
        return JsonResponse('Failed to Add!', safe=False,status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'PUT':
        product_data = JSONParser().parse(request)
        product = Product.objects.get(id = product_data['id'])
        product_serializer = ProductSerializer(product, data=product_data)
        if product_serializer.is_valid():
            product_serializer.save()
            return JsonResponse('Updated Successfully!', safe=False, status=status.HTTP_200_OK)
        return JsonResponse('Failed to Updated!', safe=False,status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        product = Product.objects.get(id = id)
        product.delete()
        return JsonResponse('Deleted Successfully!', safe=False, status=status.HTTP_204_NO_CONTENT)
    
def categoryApi(request, id = 0):
    if request.method == 'GET':
        categorys = Category.objects.all()
        categorys_serializer = CategorySerializer(categorys, many = True)
        return JsonResponse(categorys_serializer.data, safe = False)
    elif request.method == 'POST':
        category_data = JSONParser().parse(request)
        category_serializer = CategorySerializer(data = category_data)
        if category_serializer.is_valid():
            category_serializer.save()
            return JsonResponse('Added Successfully!', safe=False, status=status.HTTP_201_CREATED)
        return JsonResponse('Failed to Add!', safe=False,status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'PUT':
        category_data = JSONParser().parse(request)
        category = Category.objects.get(id = category_data['id'])
        category_serializer = CategorySerializer(category, data=category_data)
        if category_serializer.is_valid():
            category_serializer.save()
            return JsonResponse('Updated Successfully!', safe=False, status=status.HTTP_200_OK)
        return JsonResponse('Failed to Updated!', safe=False,status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        category = Category.objects.get(id = id)
        category.delete()
        return JsonResponse('Deleted Successfully!', safe=False, status=status.HTTP_204_NO_CONTENT)