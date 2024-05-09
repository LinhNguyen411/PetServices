from django.urls import path, include
from . import views
urlpatterns = [
  path('products/', views.productApi),
  path('products/<str:pk>', views.productApi),

  path('categories/', views.categoryApi),
  path('categories/<str:pk>', views.categoryApi),
]