from django.urls import path, include

from event.utils import schema_view

urlpatterns = [
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('api/', include('event.urls')),
    path('api-auth/', include('rest_framework.urls')),
]
