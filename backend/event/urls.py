from event import views
from django.urls import path

urlpatterns = [
    path('custom_user', views.CustomUserViewSet.as_view(), name='custom_user'),
]
