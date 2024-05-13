from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import JSONParser
from rest_framework import status


from .models import Bill, BillProductItem, BillServiceItem
from .serializers import BillSerializer, BillProductItemSerializer, BillServiceItemSerializer

# Create your views here.
class BillViewSet(ModelViewSet):
    queryset = Bill.objects.all()
    serializer_class = BillSerializer

    @action(detail=True, methods=['get', 'post'])
    def product_items(self, request, pk=None):
        if request.method == 'GET':
            bill_products = BillProductItem.objects.filter(bill = pk)
            serializers = BillProductItemSerializer(bill_products, many = True)
            return Response(serializers.data)
        if request.method == 'POST':
            try:
                data = request.data
                data['bill'] = pk
                serializer = BillProductItemSerializer(data=data)
                if serializer.is_valid():
                    serializer.save()
                    return Response(serializer.data)
                
            except:
                return Response("Missing data!", status=status.HTTP_400_BAD_REQUEST, safe=False)
            
    @action(detail=True, methods=['get', 'post'])
    def service_items(self, request, pk=None):
        if request.method == 'GET':
            bill_services = BillServiceItem.objects.filter(bill = pk)
            serializers = BillServiceItemSerializer(bill_services, many = True)
            return Response(serializers.data)
        if request.method == 'POST':
            try:
                data = request.data
                data['bill'] = pk
                serializer = BillServiceItemSerializer(data=data)
                if serializer.is_valid():
                    serializer.save()
                    return Response(serializer.data)
                
            except:
                return Response("Missing data!", status=status.HTTP_400_BAD_REQUEST, safe=False)
            


class BillProductItemViewSet(ModelViewSet):
    queryset = BillProductItem.objects.all()
    serializer_class = BillProductItemSerializer

class BillServiceItemViewSet(ModelViewSet):
    queryset = BillServiceItem.objects.all()
    serializer_class = BillServiceItemSerializer