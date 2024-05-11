from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('djoser.urls')),
    path('api/auth/', include('djoser.urls.jwt')),

    #customers api
    path('api/', include('customers.urls')),

    #employee api
    path('api/', include('employees.urls')),

    #products api
    path('api/', include('products.urls')),

    #pets api
    path('api/', include('pets.urls')),

    #services api
    path('api/', include('services.urls')),

]+static(settings.MEDIA_URL, document_root = settings.MEDIA_ROOT)
