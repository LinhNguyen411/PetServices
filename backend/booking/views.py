from rest_framework.viewsets import ModelViewSet
from .models import Room, ServiceBooking, Diary, SubServiceBooking
from .serializers import RoomSerializer, ServiceBookingSerializer, DiarySerializer, SubServiceBookingSerializer

from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter,OrderingFilter
from rest_framework.pagination import PageNumberPagination

# Create your views here.
class RoomViewSet(ModelViewSet):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    pagination_class = PageNumberPagination
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['is_booked']



class ServiceBookingViewSet(ModelViewSet):
    queryset = ServiceBooking.objects.all()
    serializer_class = ServiceBookingSerializer
    pagination_class = PageNumberPagination
    filter_backends = [DjangoFilterBackend, SearchFilter,OrderingFilter]
    filterset_fields = ['status', 'pet', 'service', 'customer']
    search_fields = ['id', 'date_start']

class DiaryViewSet(ModelViewSet):
    queryset = Diary.objects.all()
    serializer_class = DiarySerializer
    filter_backends = [DjangoFilterBackend,OrderingFilter]
    filterset_fields = ['booking']
    ordering_fields = ['time']

class SubServiceBookingViewSet(ModelViewSet):
    queryset = SubServiceBooking.objects.all()
    serializer_class = SubServiceBookingSerializer
    filter_backends = [DjangoFilterBackend,OrderingFilter]
    filterset_fields = ['booking']
    ordering_fields = ['is_completed']

