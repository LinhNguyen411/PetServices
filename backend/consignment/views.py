from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet
from .models import ProvideGoods, ServicePackage, ServicePackageDetail, Consignment, ConsignmentDetail, CareDetail, ConsignmentInvoice, ConsignmentDiary
from .serializers import ProvideGoodsSerializer, ServicePackageSerializer, ServicePackageDetailSerializer, ConsignmentSerializer, ConsignmentDetailSerializer, CareDetailSerializer, ConsignmentInvoiceSerializer,ConsignmentDiarySerializer


from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter,OrderingFilter
from rest_framework.pagination import PageNumberPagination
# Create your views here.
class ProvideGoodsViewSet(ModelViewSet):
    queryset = ProvideGoods.objects.all()
    serializer_class = ProvideGoodsSerializer
    pagination_class = PageNumberPagination
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['name']
    ordering_fields = ['name', 'price']

class ServicePackageViewSet(ModelViewSet):
    queryset = ServicePackage.objects.all()
    serializer_class = ServicePackageSerializer
    pagination_class = PageNumberPagination
    filter_backends = [SearchFilter,OrderingFilter]
    search_fields = ['name']
    ordering_fields = ['name', 'price']

class ServicePackageDetailViewSet(ModelViewSet):
    queryset = ServicePackageDetail.objects.all()
    serializer_class = ServicePackageDetailSerializer
    pagination_class = PageNumberPagination
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['package']

class ConsignmentViewSet(ModelViewSet):
    queryset = Consignment.objects.all()
    serializer_class = ConsignmentSerializer
    pagination_class = PageNumberPagination
    filter_backends = [DjangoFilterBackend,OrderingFilter]
    filterset_fields = ['customer', 'status']
    ordering_fields = ['date_time_create']

class ConsignmentDetailViewSet(ModelViewSet):
    queryset = ConsignmentDetail.objects.all()
    serializer_class = ConsignmentDetailSerializer
    pagination_class = PageNumberPagination
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['consignment', 'is_paid']

class CareDetailViewSet(ModelViewSet):
    queryset = CareDetail.objects.all()
    serializer_class = CareDetailSerializer
    pagination_class = PageNumberPagination
    filter_backends = [DjangoFilterBackend,OrderingFilter]
    filterset_fields = ['con_detail']

class ConsignmentDiaryViewSet(ModelViewSet):
    queryset = ConsignmentDiary.objects.all()
    serializer_class = ConsignmentDiarySerializer
    pagination_class = PageNumberPagination
    filter_backends = [DjangoFilterBackend,OrderingFilter]
    filterset_fields = ['con_detail']
    ordering_fields = ['date_time_create']

class ConsignmentInvoiceViewSet(ModelViewSet):
    queryset = ConsignmentInvoice.objects.all()
    serializer_class = ConsignmentInvoiceSerializer
    pagination_class = PageNumberPagination
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['con_detail']
