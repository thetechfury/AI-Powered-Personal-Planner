from event import views
from django.urls import path

urlpatterns = [
    path('custom-user', views.CustomUserViewSet.as_view(), name='custom_user'),
    path('create-chat', views.ChatCreateViewSet.as_view(), name='create_chat'),
    path('chat-history', views.ChatListViewSet.as_view(), name='chats'),
    path('task-history', views.TaskListViewSet.as_view(), name='tasks'),
    path('create-task', views.TaskCreateView.as_view(), name='create_task'),
    path('update-task/<int:pk>', views.TaskUpdateView.as_view(), name='update_task'),
    path('cancel-task/<int:pk>', views.TaskCancelView.as_view(), name='cancel_task'),
    path('tags-list', views.TagsListViewSet.as_view(), name='tags-list'),
    path('create-tag', views.TagsCreateViewSet.as_view(), name='create-tag'),
]
