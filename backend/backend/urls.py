from django.urls import path, include

import event

urlpatterns = [
    path('api/', include('event.urls')),
    path('api-auth/', include('rest_framework.urls')),
]
