# Generated by Django 4.2.4 on 2023-08-17 10:33

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('mainapp', '0007_task_user_id'),
    ]

    operations = [
        migrations.RenameField(
            model_name='task',
            old_name='user_id',
            new_name='user',
        ),
    ]
