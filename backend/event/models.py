from datetime import datetime, timedelta
from django.utils import timezone
from django.core.exceptions import ValidationError
from django.db import models


class CustomUser(models.Model):
    session_id = models.CharField(max_length=45)
    notifications_preferences = models.BooleanField(default=True, null=False)

    def __str__(self):
        return f"User {self.id} - {self.session_id}"


class Tag(models.Model):
    title = models.CharField(max_length=50, unique=True)
    color = models.CharField(max_length=45, unique=True)

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        self.title = self.title.lower()
        self.color = self.color.lower()
        super().save(*args, **kwargs)


class Task(models.Model):
    TASK_TYPES = [
        ('event', 'Event'),
        ('reminder', 'Reminder'),
        ('flexible', 'Flexible'),
    ]

    STATUSES = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('canceled', 'Canceled'),
    ]

    title = models.CharField(max_length=50)
    task_type = models.CharField(max_length=45, choices=TASK_TYPES)
    date = models.DateTimeField()
    start_time = models.TimeField()
    end_time = models.TimeField(null=True, blank=True)
    duration = models.PositiveIntegerField(default=0)
    recurring = models.CharField(max_length=250, null=True, blank=True)
    status = models.CharField(max_length=45, choices=STATUSES, default='pending')
    tag = models.ForeignKey(Tag, on_delete=models.CASCADE, null=True)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        current_datetime = timezone.now()
        if self.date < current_datetime:
            raise ValidationError("The task date and time cannot be in the past.")
        task_start_datetime = datetime.combine(self.date.date(), self.start_time)
        task_start_datetime = timezone.make_aware(task_start_datetime, timezone.get_current_timezone())
        if task_start_datetime < current_datetime:
            raise ValidationError("The start time cannot be in the past.")
        if self.duration and self.end_time:
            calculated_end_time = (
                    datetime.combine(self.date.date(), self.start_time) + timedelta(minutes=self.duration)).time()
            if calculated_end_time != self.end_time:
                raise ValidationError("The provided end time does not match the start time and duration.")
        if self.start_time and self.duration and not self.end_time:
            start_datetime = datetime.combine(self.date.date(), self.start_time)
            self.end_time = (start_datetime + timedelta(minutes=self.duration)).time()

        super().save(*args, **kwargs)


class Chat(models.Model):
    SENDER_CHOICES = [
        ('user', 'User'),
        ('ai', 'AI Bot'),
    ]
    text = models.TextField()
    send_by = models.CharField(max_length=45, choices=SENDER_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)

    def __str__(self):
        return f"Chat {self.id} - {self.user.session_id}"

    class Meta:
        ordering = ['created_at']
