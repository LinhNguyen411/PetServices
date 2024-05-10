from django.urls import path, include
from . import views
urlpatterns = [
  path('pets/', views.petApi),
  path('pets/<str:pk>', views.petApi),

  path('species/', views.speciesApi),
  path('species/<str:pk>', views.speciesApi),

  path('weights/', views.weightApi),
  path('weights/<str:pk>', views.weightApi),
]