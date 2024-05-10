from django.urls import path, include
from . import views
urlpatterns = [
  path('employee/', views.employeeApi),
  path('employee/<str:pk>', views.employeeApi),

  path('work-schedule/', views.workScheduleApi),
  path('work-schedule/<str:pk>', views.workScheduleApi)
]