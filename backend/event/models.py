from datetime import datetime, timedelta

from django.core.exceptions import ValidationError
from django.db import models


class CustomUser(models.Model):
    session_id = models.CharField(max_length=45)
    notifications_preferences = models.BooleanField(default=True, null=False)

    def __str__(self):
        return f"User {self.id} - {self.session_id}"


class Category(models.Model):
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

    title = models.CharField(max_length=50)
    task_type = models.CharField(max_length=45, choices=TASK_TYPES)
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField(blank=True, null=True)
    hours = models.PositiveIntegerField(blank=True, null=True)
    recurring = models.CharField(max_length=45)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if self.hours is not None and self.end_time is None:
            # Calculate end_time based on hours
            self.end_time = (datetime.combine(self.date, self.start_time) + timedelta(hours=self.hours)).time()

        elif self.end_time is not None and self.hours is None:
            # Calculate hours based on start_time and end_time
            start = datetime.combine(self.date, self.start_time)
            end = datetime.combine(self.date, self.end_time)
            if end < start:
                raise ValidationError("End time cannot be earlier than start time.")
            self.hours = int((end - start).total_seconds() // 3600)

        elif self.hours is not None and self.end_time is not None:
            # Ensure hours and end_time match
            calculated_end_time = (datetime.combine(self.date, self.start_time) + timedelta(hours=self.hours)).time()
            if calculated_end_time != self.end_time:
                raise ValidationError("The provided end time does not match the start time and duration.")

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