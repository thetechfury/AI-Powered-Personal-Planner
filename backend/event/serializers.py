from rest_framework import serializers
from event.models import CustomUser, Tag, Task, Chat


class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'session_id', 'notifications_preferences']


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'title', 'color']


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['title', 'task_type', 'date', 'start_time', 'end_time', 'duration', 'recurring', 'tag']
        read_only_fields = ['user']

    def validate(self, data):
        if data['end_time'] and data['start_time'] and data['end_time'] <= data['start_time']:
            raise serializers.ValidationError("End time must be after start time.")
        return data


class ChatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chat
        fields = ['id', 'text', 'send_by', 'created_at', 'user']
