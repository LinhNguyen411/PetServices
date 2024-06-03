from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework.decorators import action

from rest_framework.filters import OrderingFilter,SearchFilter
from rest_framework.pagination import PageNumberPagination
from django_filters.rest_framework import DjangoFilterBackend


from .models import ServiceBill, ProductBill, ProductBillItem, Surcharge
from .serializers import ServiceBillSerializer, ProductBillSerializer, ProductBillItemSerializer,SurchargeSerializer

# Create your views here.
class ServiceBillViewSet(ModelViewSet):
    queryset = ServiceBill.objects.all()
    serializer_class = ServiceBillSerializer
    filter_backends = [DjangoFilterBackend,OrderingFilter, SearchFilter]
    pagination_class = PageNumberPagination
    search_fields = ['id']
    filterset_fields = ['employee', 'payment_method', 'booking']
    ordering_fields = [ 'date_created']

class SurchargeViewSet(ModelViewSet):
    queryset = Surcharge.objects.all()
    serializer_class = SurchargeSerializer
    filter_backends = [DjangoFilterBackend]
    pagination_class = PageNumberPagination
    filterset_fields = ['bill']

class ProductBillViewSet(ModelViewSet):
    queryset = ProductBill.objects.all()
    serializer_class = ProductBillSerializer
    filter_backends = [DjangoFilterBackend,OrderingFilter,SearchFilter]
    pagination_class = PageNumberPagination
    search_fields = ['id']
    filterset_fields = ['employee', 'payment_method']
    ordering_fields = [ 'date_created']
    @action(detail=True, methods=['POST', 'GET'])
    def items(self, request, pk = None):
        try:
            bill = self.get_object()
        except ProductBill.DoesNotExist:
            return Response({"error": "Bill not found!"}, status = 404)
        if request.method == 'GET':
            items = ProductBillItem.objects.filter(bill = bill)
            serializers = ProductBillItemSerializer(items, many = True)
            return Response(serializers.data)
        if request.method == 'POST':
            data = request.data
            data["bill"] = bill.id
            print(data)
            serializer = ProductBillItemSerializer(data = data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=200)
            return Response({"error": "Missing value"}, status=400)

class ProductBillItemViewSet(ModelViewSet):
    queryset = ProductBillItem.objects.all()
    serializer_class = ProductBillItemSerializer