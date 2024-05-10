from django.urls import path, include
from . import views
urlpatterns = [
  path('services/', views.serviceApi),
  path('services/<str:pk>', views.serviceApi),

  path('service_prices/', views.servicePriceApi),
  path('service_prices/<str:pk>', views.servicePriceApi),
]