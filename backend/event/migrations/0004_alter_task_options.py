# Generated by Django 5.1.1 on 2024-10-22 12:49

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('event', '0003_alter_task_options'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='task',
            options={'ordering': ['-date', '-start_time']},
        ),
    ]
