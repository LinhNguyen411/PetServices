from rest_framework.viewsets import ModelViewSet
from .models import Room, ServiceBooking, SubService, Diary, PetCheckInOut
from .serializers import RoomSerializer, SubServiceSerializer, ServiceBookingSerializer, DiarySerializer, PetCheckInOutSerializer

# Create your views here.
class RoomViewSet(ModelViewSet):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer

class ServiceBookingViewSet(ModelViewSet):
    queryset = ServiceBooking.objects.all()
    serializer_class = ServiceBookingSerializer

class SubServiceViewSet(ModelViewSet):
    queryset = SubService.objects.all()
    serializer_class = SubServiceSerializer

class DiaryViewSet(ModelViewSet):
    queryset = Diary.objects.all()
    serializer_class = DiarySerializer

class PetCheckInOutViewSet(ModelViewSet):
    queryset = PetCheckInOut.objects.all()
    serializer_class = PetCheckInOutSerializer
