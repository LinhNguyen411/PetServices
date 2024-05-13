from rest_framework.viewsets import ModelViewSet

from .models import Employee, WorkSchedule
from .serializers import EmployeeSerializer, WorkScheduleSerializer

class EmployeeViewSet(ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer

class WorkScheduleViewSet(ModelViewSet):
    queryset = WorkSchedule.objects.all()
    serializer_class = WorkScheduleSerializer