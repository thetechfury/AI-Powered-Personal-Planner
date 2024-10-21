from drf_yasg.utils import swagger_auto_schema
from rest_framework.generics import GenericAPIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone

from backend.urls import header_param
from event.decorators import custom_user_authentication
from event.models import CustomUser, Task, Chat, Tag
from event.serializers import CustomUserSerializer, TaskSerializer, ChatSerializer, TagSerializer
from event.utils import ChatPagination, TaskPagination


class CustomUserViewSet(GenericAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer

    @swagger_auto_schema(manual_parameters=[header_param])
    @custom_user_authentication
    def get(self, request):
        user = request.user
        serializer = CustomUserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ChatCreateViewSet(GenericAPIView):
    queryset = Chat.objects.all()
    serializer_class = ChatSerializer
    permission_classes = [AllowAny]

    @swagger_auto_schema(manual_parameters=[header_param])
    @custom_user_authentication
    def post(self, request):
        user = request.user
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        serializer.save(user=user, send_by='user')
        message_to_send = "helloworld"
        Chat.objects.create(text=message_to_send, send_by='ai', user=user)
        return Response({"message": message_to_send}, status=status.HTTP_200_OK)


class ChatListViewSet(GenericAPIView):
    queryset = Chat.objects.all()
    serializer_class = ChatSerializer
    pagination_class = ChatPagination

    @swagger_auto_schema(manual_parameters=[header_param])
    @custom_user_authentication
    def get(self, request):
        user = request.user
        chats = Chat.objects.filter(user=user).order_by('created_at')
        page = self.paginate_queryset(chats)
        if page is not None:
            serializer = self.get_paginated_response(ChatSerializer(page, many=True).data)
        else:
            serializer = ChatSerializer(chats, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)


class TaskListViewSet(GenericAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    pagination_class = TaskPagination

    @swagger_auto_schema(manual_parameters=[header_param])
    @custom_user_authentication
    def get(self, request):
        user = request.user
        current_time = timezone.now()
        tasks = Task.objects.filter(user=user).filter(
            date__gte=current_time.date(),
            start_time__gt=current_time.time()
        )
        page = self.paginate_queryset(tasks)
        if page is not None:
            serializer = self.get_paginated_response(ChatSerializer(page, many=True).data)
        else:
            serializer = ChatSerializer(tasks, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)


class TaskCreateView(GenericAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [AllowAny]

    @swagger_auto_schema(manual_parameters=[header_param])
    @custom_user_authentication
    def post(self, request, *args, **kwargs):
        user = request.user
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        serializer.save(user=user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class TagsListViewSet(GenericAPIView):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        tags = self.get_queryset()
        serializer = self.get_serializer(tags, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class TagsCreateViewSet(GenericAPIView):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
