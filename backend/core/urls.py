from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('djoser.urls')),
    path('api/auth/', include('djoser.urls.jwt')),

    #api
    path('api/', include('api.urls')),

]+static(settings.MEDIA_URL, document_root = settings.MEDIA_ROOT)
