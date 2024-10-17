from event import views
from django.urls import path

urlpatterns = [
    path('custom-user', views.CustomUserViewSet.as_view(), name='custom_user'),
    path('create-chat', views.ChatViewSet.as_view(), name='create_chat'),
]
