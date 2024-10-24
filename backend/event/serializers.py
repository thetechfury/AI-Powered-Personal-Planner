from rest_framework import serializers
from event.models import CustomUser, Tag, Task, Chat


class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'session_id', 'notifications_preferences']
        extra_kwargs = {
            'session_id': {
                'help_text': 'Session id is auto generated.',
            },
        }


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'title', 'color']


class TaskSerializer(serializers.ModelSerializer):
    tag = TagSerializer(read_only=True)

    class Meta:
        model = Task
        fields = ['id', 'title', 'task_type', 'date', 'start_time', 'end_time', 'duration', 'recurring', 'status',
                  'tag', 'user']
        read_only_fields = ['tag', 'end_time', 'user']
        extra_kwargs = {
            'status': {'required': False},
            'duration': {
                'help_text': 'Add duration in minutes.'
            },
            'recurring': {
                'help_text': 'Add comma seperated day names.'
            },
            'tag': {
                'help_text': 'Add tag name in string format.'
            }
        }


class ChatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chat
        fields = ['id', 'text', 'send_by', 'user', 'created_at']
        read_only_fields = ['send_by', 'user', 'created_at']
