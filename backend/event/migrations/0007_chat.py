# Generated by Django 5.1.1 on 2024-10-17 05:06

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('event', '0006_task_hours_alter_task_end_time_alter_task_recurring'),
    ]

    operations = [
        migrations.CreateModel(
            name='Chat',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('text', models.TextField(blank=True, null=True)),
                ('send_by', models.CharField(choices=[('user', 'User'), ('ai', 'AI Bot')], max_length=45)),
                ('created_at', models.DateTimeField(blank=True, null=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='event.customuser')),
            ],
        ),
    ]
