import uuid

from rest_framework.generics import GenericAPIView, ListAPIView, CreateAPIView
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from event.decorators import custom_user_authentication
from event.models import CustomUser, Task, Chat, Category
from event.serializers import CustomUserSerializer, TaskSerializer, ChatSerializer, CategorySerializer


class ChatPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'


class TaskPagination(PageNumberPagination):
    page_size = 3
    page_size_query_param = 'page_size'


class CustomUserViewSet(GenericAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer

    @custom_user_authentication
    def get(self, request):
        user= request.user
        serializer = CustomUserSerializer(user)
        return Response({"data": serializer.data}, status=status.HTTP_200_OK)


class ChatCreateViewSet(GenericAPIView):
    queryset = Chat.objects.all()
    serializer_class = ChatSerializer
    permission_classes = [AllowAny]

    @custom_user_authentication
    def post(self, request):
        text = request.data.get('text', '')
        user = request.user

        if text:
            Chat.objects.create(text=text, send_by='user', user=user)
            message_to_send = "helloworld"
            Chat.objects.create(text=message_to_send, send_by='ai', user=user)
            return Response({"message": message_to_send}, status=status.HTTP_200_OK)
        return Response({"error": "Invalid text"}, status=status.HTTP_400_BAD_REQUEST)


class ChatListViewSet(ListAPIView):
    serializer_class = ChatSerializer
    pagination_class = ChatPagination

    # @custom_user_authentication
    def get_queryset(self):
        session_id = self.request.META.get('HTTP_SESSION_ID', '')
        user = CustomUser.objects.filter(session_id=session_id).first()
        if user:
            return Chat.objects.filter(user=user).order_by('created_at')
        return Chat.objects.none()

    # @custom_user_authentication
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        page = self.paginate_queryset(queryset)
        session_id = self.request.META.get('HTTP_SESSION_ID', '')
        if not session_id:
            return Response({"error": "Invalid user session or text"}, status=status.HTTP_400_BAD_REQUEST)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class TaskListViewSet(ListAPIView):
    serializer_class = TaskSerializer
    pagination_class = TaskPagination

    # @custom_user_authentication
    def get_queryset(self):
        session_id = self.request.META.get('HTTP_SESSION_ID', '')
        user = CustomUser.objects.filter(session_id=session_id).first()
        if user:
            return Task.objects.filter(user=user, date__gt=timezone.now()).order_by('date')
        return Task.objects.none()

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        page = self.paginate_queryset(queryset)
        session_id = self.request.META.get('HTTP_SESSION_ID', '')
        if not session_id:
            return Response({"error": "Invalid user session or text"}, status=status.HTTP_400_BAD_REQUEST)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class TaskCreateView(CreateAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

    # @custom_user_authentication
    def post(self, request, *args, **kwargs):
        session_id = self.request.META.get('HTTP_SESSION_ID', '')
        user = CustomUser.objects.filter(session_id=session_id).first()
        if user:
            request.data['user'] = user.id
            request.data['category'] = 1
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response({"error": "Invalid user"}, status=status.HTTP_400_BAD_REQUEST)


class CategoryViewSet(GenericAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        categories = self.get_queryset()
        serializer = self.get_serializer(categories, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
