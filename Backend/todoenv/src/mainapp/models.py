from django.db import models
from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin


class AppUserManager(BaseUserManager):
    def create_user(self, username, password):
        if not username:
            raise ValueError("An username is required.")
        if not password:
            raise ValueError("A password is required.")
        user = self.model(username=username)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, username, password):
        if not username:
            raise ValueError("An username is required.")
        if not password:
            raise ValueError("A password is required.")
        user = self.create_user(username, password)
        user.is_staff = True
        user.is_superuser = True

        user.save()
        return user


class AppUser(AbstractBaseUser, PermissionsMixin):
    id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=50, unique=True)
    is_staff = models.BooleanField(default=False)

    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = ["password"]
    objects = AppUserManager()

    def __str__(self):
        return self.username


class Task(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    created = models.DateField(auto_now_add=True)
    due_date = models.DateField()
    completed = models.BooleanField(default=False, null=True)
    user = models.ForeignKey(AppUser, on_delete=models.CASCADE)

    def __str__(self):
        return self.title
