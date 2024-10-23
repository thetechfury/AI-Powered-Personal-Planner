from rest_framework.pagination import PageNumberPagination
from drf_yasg.views import get_schema_view
from rest_framework import permissions
from drf_yasg import openapi


class ChatPagination(PageNumberPagination):
    page_size = 10


class TaskPagination(PageNumberPagination):
    page_size = 3


header_param = openapi.Parameter(
    'Session-Id',
    openapi.IN_HEADER,
    description="Session ID provided by the authentication system. Include this in the header for session tracking and user authentication.",
    type=openapi.TYPE_STRING
)

month_param = openapi.Parameter(
    'month',
    openapi.IN_QUERY,
    description="Filter tasks by month (1-12). Defaults to the current month if not provided.",
    type=openapi.TYPE_INTEGER
)

schema_view = get_schema_view(
    openapi.Info(
        title="AI Planner APIs",
        default_version='v1',
        description="API for AI Planner",
    ),
    public=True,
    permission_classes=[permissions.AllowAny, ],
)
