# Generated by Django 5.1.1 on 2024-10-22 06:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('event', '0013_alter_task_options_task_status'),
    ]

    operations = [
        migrations.AlterField(
            model_name='task',
            name='end_time',
            field=models.TimeField(blank=True, null=True),
        ),
    ]
