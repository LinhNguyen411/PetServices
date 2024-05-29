from rest_framework.viewsets import ModelViewSet
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter,OrderingFilter
from rest_framework.pagination import PageNumberPagination

from .models import Product, Category, Supplier
from .serializers import ProductSerializer, CategorySerializer, SupplierSerializer

class ProductViewSet(ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter,OrderingFilter]
    pagination_class = PageNumberPagination
    filterset_fields = ['category', 'species', 'supplier']
    search_fields = ['id','name','description']
    ordering_fields = ['name','price', 'quantity']



class CategoryViewSet(ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    pagination_class = PageNumberPagination
    filter_backends = [OrderingFilter]
    ordering_fields = ['name']



class SupplierViewSet(ModelViewSet):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer
    pagination_class = PageNumberPagination
    filter_backends = [ SearchFilter, OrderingFilter]
    search_fields = ['name', 'phone_number']
    ordering_fields = ['name']


