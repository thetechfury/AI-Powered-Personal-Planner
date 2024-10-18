import uuid

from rest_framework.generics import GenericAPIView, ListAPIView, CreateAPIView
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework.viewsets import ModelViewSet

from event.decorators import custom_user_authentication
from event.models import CustomUser, Task, Chat, Category
from event.serializers import CustomUserSerializer, TaskSerializer, ChatSerializer, CategorySerializer


class Pagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100


class CustomUserViewSet(GenericAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer

    @custom_user_authentication
    def get(self, request):
        user = request.user
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
        return Response({"error": "Invalid user session or text"}, status=status.HTTP_400_BAD_REQUEST)


class ChatListViewSet(ListAPIView):
    serializer_class = ChatSerializer
    pagination_class = Pagination

    @custom_user_authentication
    def get_queryset(self):
        user = self.request.user
        if user:
            return Chat.objects.filter(user=user).order_by('created_at')
        return Chat.objects.none()

    @custom_user_authentication
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)


class TaskListViewSet(ListAPIView):
    serializer_class = TaskSerializer
    pagination_class = Pagination

    @custom_user_authentication
    def get_queryset(self):
        return Task.objects.filter(user=self.request.user).order_by('created_at')

    @custom_user_authentication
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)


class TaskCreateView(CreateAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

    @custom_user_authentication
    def post(self, request, *args, **kwargs):
        user = request.user
        request.data['user'] = user.id
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


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
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def perform_create(self, serializer):
        serializer.save()