from rest_framework.viewsets import ModelViewSet
from .models import Room, ServiceBooking, SubService, Diary, PetCheckInOut
from .serializers import RoomSerializer, SubServiceSerializer, ServiceBookingSerializer, DiarySerializer, PetCheckInOutSerializer

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
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['status']
    search_fields = ['id']

class SubServiceViewSet(ModelViewSet):
    queryset = SubService.objects.all()
    serializer_class = SubServiceSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['service_booking']


class DiaryViewSet(ModelViewSet):
    queryset = Diary.objects.all()
    serializer_class = DiarySerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['booking']

class PetCheckInOutViewSet(ModelViewSet):
    queryset = PetCheckInOut.objects.all()
    serializer_class = PetCheckInOutSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['booking']
