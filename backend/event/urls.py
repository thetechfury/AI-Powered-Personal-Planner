from rest_framework import routers

from event import views
from event.views import TaskViewSet, CategoryViewSet

router = routers.DefaultRouter()
router.register('custom_user', views.CustomUserViewSet, basename='custom_user')
router.register(r'tasks', TaskViewSet)
router.register(r'categories', CategoryViewSet)
