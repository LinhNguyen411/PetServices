from django.urls import path, include
from . import views
urlpatterns = [
  path('customers/', views.customerApi),
  path('customers/<str:pk>', views.customerApi)
]