# Generated by Django 4.2.4 on 2023-08-15 15:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('mainapp', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='appuser',
            name='email',
        ),
        migrations.AlterField(
            model_name='appuser',
            name='username',
            field=models.CharField(max_length=50, unique=True),
        ),
    ]