import uuid

from django.http import JsonResponse
from rest_framework import viewsets
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response

from event.models import CustomUser, Task, Category
from event.serializers import CustomUserSerializer, TaskSerializer, CategorySerializer


class CustomUserViewSet(GenericAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer

    def get(self, request):
        session_id = self.get_session_id(request)
        if session_id:
            user = CustomUser.objects.filter(session_id=session_id).first()
            if not user:
                user = self.create_user()
        else:
            user = self.create_user()
        serializer = CustomUserSerializer(user)
        return Response(serializer.data)

    def get_session_id(self, request):
        http_cookie = request.META.get('HTTP_COOKIE', '')
        session_id = None
        # Split the cookie string into individual cookies
        cookies = http_cookie.split(';')
        # Iterate over each cookie to find the session_id
        for cookie in cookies:
            # Strip leading/trailing whitespace and split into key-value pair
            key_value = cookie.strip().split('=')
            if len(key_value) == 2:
                key, value = key_value
                if key == 'session_id':
                    session_id = value
                    break
        return session_id

    def create_user(self):
        session_id = str(uuid.uuid4())
        user = CustomUser.objects.create(session_id=session_id)
        return user


class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
