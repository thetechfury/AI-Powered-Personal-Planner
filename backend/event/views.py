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
        session_id = request.COOKIES.get('session_id')

        if session_id:
            user = CustomUser.objects.filter(session_id=session_id).first()
            if not user:
                user = self.create_user()
                session_id = user.session_id
        else:
            user = self.create_user()
            session_id = user.session_id

        serializer = CustomUserSerializer(user)

        response = Response(serializer.data)
        response.set_cookie('session_id', session_id, httponly=True)
        return response

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
