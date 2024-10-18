import uuid
from functools import wraps

from event.models import CustomUser


def custom_user_authentication(view_func):
    @wraps(view_func)
    def _wrapped_view(self):
        session_id = self.request.META.get('HTTP_SESSION_ID', '')
        user = CustomUser.objects.filter(session_id=session_id).first()
        if not user:
            user = CustomUser.objects.create(session_id=str(uuid.uuid4()))
        self.request.user = user
        return view_func(self)

    return _wrapped_view

