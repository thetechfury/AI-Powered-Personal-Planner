import uuid

from rest_framework import viewsets
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from rest_framework import status

from event.models import CustomUser, Task, Category, Chat
from event.serializers import CustomUserSerializer, TaskSerializer, CategorySerializer, ChatSerializer


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
        return Response({"data": serializer.data}, status=status.HTTP_200_OK)

    def get_session_id(self, request):
        http_cookie = request.META.get('HTTP_COOKIE', '')
        session_id = None
        cookies = http_cookie.split(';')
        for cookie in cookies:
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


class ChatViewSet(GenericAPIView):
    queryset = Chat.objects.all()
    serializer_class = ChatSerializer

    def post(self, request):
        text = request.data.get('input_text', '')
        user_session = request.data.get('user_session', '')

        if text and user_session:
            try:
                user = CustomUser.objects.get(session=user_session)
                Chat.objects.create(text=text, send_by='user', user=user)
            except CustomUser.DoesNotExist:
                return Response({"error": "Invalid user session"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"error": "Invalid user session or text"}, status=status.HTTP_400_BAD_REQUEST)

        message_to_send = "helloworld"
        return Response({"message": message_to_send}, status=status.HTTP_200_OK)