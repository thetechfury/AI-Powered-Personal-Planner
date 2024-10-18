import uuid

from rest_framework.generics import GenericAPIView, ListAPIView, CreateAPIView
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status

from event.models import CustomUser, Task, Chat
from event.serializers import CustomUserSerializer, TaskSerializer, ChatSerializer


class SessionMixin:
    """
    A mixin to handle session-based user retrieval and validation.
    """

    def get_user_by_session(self, session_id):
        try:
            return CustomUser.objects.get(session_id=session_id)
        except CustomUser.DoesNotExist:
            return None

    def get_session_id(self, request):
        """
        Retrieve session_id from cookies in the request.
        """
        http_cookie = request.META.get('HTTP_COOKIE', '')
        cookies = http_cookie.split(';')
        for cookie in cookies:
            key_value = cookie.strip().split('=')
            if len(key_value) == 2:
                key, value = key_value
                if key == 'session_id':
                    return value
        return None


class Pagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100


class CustomUserViewSet(SessionMixin, GenericAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer

    def get(self, request):
        session_id = request.META.get('HTTP_SESSION_ID', '')
        user = self.get_user_by_session(session_id) if session_id else None

        if not user:
            user = self.create_user()

        serializer = CustomUserSerializer(user)
        return Response({"data": serializer.data}, status=status.HTTP_200_OK)

    def create_user(self):
        return CustomUser.objects.create(session_id=str(uuid.uuid4()))


class ChatCreateViewSet(SessionMixin, GenericAPIView):
    queryset = Chat.objects.all()
    serializer_class = ChatSerializer
    permission_classes = [AllowAny]

    def post(self, request):
        text = request.data.get('text', '')
        session_id = request.META.get('HTTP_SESSION_ID', '')
        user = self.get_user_by_session(session_id)

        if text and user:
            Chat.objects.create(text=text, send_by='user', user=user)
            message_to_send = "helloworld"
            Chat.objects.create(text=message_to_send, send_by='ai', user=user)
            return Response({"message": message_to_send}, status=status.HTTP_200_OK)
        return Response({"error": "Invalid user session or text"}, status=status.HTTP_400_BAD_REQUEST)


class ChatListViewSet(SessionMixin, ListAPIView):
    serializer_class = ChatSerializer
    pagination_class = Pagination

    def get_queryset(self):
        session_id = self.request.META.get('HTTP_SESSION_ID', '')
        user = self.get_user_by_session(session_id)
        if user:
            return Chat.objects.filter(user=user).order_by('-created_at')
        return Chat.objects.none()

    def list(self, request, *args, **kwargs):
        session_id = request.META.get('HTTP_SESSION_ID', '')
        if not session_id or not self.get_user_by_session(session_id):
            return Response({"error": "Invalid user session"}, status=status.HTTP_400_BAD_REQUEST)

        return super().list(request, *args, **kwargs)


class TaskListViewSet(SessionMixin, ListAPIView):
    serializer_class = TaskSerializer
    pagination_class = Pagination

    def get_queryset(self):
        session_id = self.request.META.get('HTTP_SESSION_ID', '')
        user = self.get_user_by_session(session_id)
        if user:
            return Task.objects.filter(user=user).order_by('-created_at')
        return Task.objects.none()

    def list(self, request, *args, **kwargs):
        session_id = request.META.get('HTTP_SESSION_ID', '')
        if not session_id or not self.get_user_by_session(session_id):
            return Response({"error": "Invalid user session"}, status=status.HTTP_400_BAD_REQUEST)

        return super().list(request, *args, **kwargs)


class TaskCreateView(CreateAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
