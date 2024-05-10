from django.views.decorators.csrf import csrf_exempt
from django.http.response import JsonResponse

from rest_framework.parsers import JSONParser
from rest_framework import status

from .models import Employee, WorkSchedule
from .serializers import EmployeeSerializer, WorkScheduleSerializer

@csrf_exempt
def employeeApi(request, id = 0):
    if request.method == 'GET':
        employees = Employee.objects.all()
        employees_serializer = EmployeeSerializer(employees, many = True)
        return JsonResponse(employees_serializer.data, safe = False)
    elif request.method == 'POST':
        employee_data = JSONParser().parse(request)
        employee_serializer = EmployeeSerializer(data = employee_data)
        if employee_serializer.is_valid():
            employee_serializer.save()
            return JsonResponse('Added Successfully!', safe=False, status=status.HTTP_201_CREATED)
        return JsonResponse('Failed to Add!', safe=False,status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'PUT':
        employee_data = JSONParser().parse(request)
        employee = Employee.objects.get(id = employee_data['id'])
        employee_serializer = EmployeeSerializer(employee, data=employee_data)
        if employee_serializer.is_valid():
            employee_serializer.save()
            return JsonResponse('Updated Successfully!', safe=False, status=status.HTTP_200_OK)
        return JsonResponse('Failed to Updated!', safe=False,status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        employee = Employee.objects.get(id = id)
        employee.delete()
        return JsonResponse('Deleted Successfully!', safe=False, status=status.HTTP_204_NO_CONTENT)
    
@csrf_exempt
def workScheduleApi(request, id = 0):
    if request.method == 'GET':
        workSchedules = WorkSchedule.objects.all()
        workSchedules_serializer = WorkScheduleSerializer(workSchedules, many = True)
        return JsonResponse(workSchedules_serializer.data, safe = False)
    elif request.method == 'POST':
        workSchedule_data = JSONParser().parse(request)
        workSchedule_serializer = WorkScheduleSerializer(data = workSchedule_data)
        if workSchedule_serializer.is_valid():
            workSchedule_serializer.save()
            return JsonResponse('Added Successfully!', safe=False, status=status.HTTP_201_CREATED)
        return JsonResponse('Failed to Add!', safe=False,status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'PUT':
        workSchedule_data = JSONParser().parse(request)
        workSchedule = WorkSchedule.objects.get(id = workSchedule_data['id'])
        workSchedule_serializer = WorkScheduleSerializer(workSchedule, data=workSchedule_data)
        if workSchedule_serializer.is_valid():
            workSchedule_serializer.save()
            return JsonResponse('Updated Successfully!', safe=False, status=status.HTTP_200_OK)
        return JsonResponse('Failed to Updated!', safe=False,status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        workSchedule = WorkSchedule.objects.get(id = id)
        workSchedule.delete()
        return JsonResponse('Deleted Successfully!', safe=False, status=status.HTTP_204_NO_CONTENT)