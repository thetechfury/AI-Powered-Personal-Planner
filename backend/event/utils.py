import random

from rest_framework.pagination import PageNumberPagination
from drf_yasg.views import get_schema_view
from rest_framework import permissions
from drf_yasg import openapi
from rest_framework.response import Response
from rest_framework import status

from event.models import Tag


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

page_param = openapi.Parameter(
    'page',
    in_=openapi.IN_QUERY,
    description="Page number for paginated results. Do not add page parameter or Leave blank to retrieve all tasks.",
    type=openapi.TYPE_INTEGER,
    required=False
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


def generate_random_color():
    return "#{:06x}".format(random.randint(0, 0xFFFFFF))

def get_tag_item(tag_title):
    if tag_title:
        tag, created = Tag.objects.get_or_create(title=tag_title.lower(),
                                                 defaults={'color': generate_random_color()})
        return tag
    else:
        return Response({"error": "Tag is required."}, status=status.HTTP_400_BAD_REQUEST)