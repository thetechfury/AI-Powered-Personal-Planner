from rest_framework.pagination import PageNumberPagination
from drf_yasg.views import get_schema_view
from rest_framework import permissions
from drf_yasg import openapi


class ChatPagination(PageNumberPagination):
    page_size = 10


class TaskPagination(PageNumberPagination):
    page_size = 3


header_param = openapi.Parameter('Session-Id', openapi.IN_HEADER, description="Header param", type=openapi.IN_HEADER)

schema_view = get_schema_view(
    openapi.Info(
        title="AI Planner APIs",
        default_version='v1',
        description="API for AI Planner",
    ),
    public=True,
    permission_classes=[permissions.AllowAny, ],
)
