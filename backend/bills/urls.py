from django.urls import path, include
from . import views
urlpatterns = [
  path('bills/', views.billApi),
  path('bills/<str:pk>', views.billApi),

  path('bill_product_items/', views.billProductItemApi),
  path('bill_product_items/<str:pk>', views.billProductItemApi),

  path('bill_service_items/', views.billServiceItemApi),
  path('bill_service_items/<str:pk>', views.billServiceItemApi),
]