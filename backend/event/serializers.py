from rest_framework import serializers
from event.models import CustomUser, Category, Task, Chat


class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'session_id', 'notifications_preferences']


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'title', 'color']


class TaskSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    user = CustomUserSerializer(read_only=True)

    class Meta:
        model = Task
        fields = [
            'id', 'title', 'task_type', 'date', 'start_time', 'end_time',
            'recurring', 'category', 'user'
        ]


class ChatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chat
        fields = ['id', 'text', 'send_by', 'created_at', 'user']
