# Generated by Django 4.2.4 on 2023-08-15 16:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('mainapp', '0002_remove_appuser_email_alter_appuser_username'),
    ]

    operations = [
        migrations.AddField(
            model_name='appuser',
            name='is_staff',
            field=models.BooleanField(default=None),
            preserve_default=False,
        ),
    ]
