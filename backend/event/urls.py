from event import views
from django.urls import path

urlpatterns = [
    path('custom-user', views.CustomUserViewSet.as_view(), name='custom_user'),
    path('create-chat', views.ChatCreateViewSet.as_view(), name='create_chat'),
    path('chat-history', views.ChatListViewSet.as_view(), name='chats'),
    path('task-history', views.TaskListViewSet.as_view(), name='tasks'),
    path('create-task', views.TaskCreateView.as_view(), name='create_task'),
    path('categories', views.CategoryViewSet.as_view(), name='categories'),
]
