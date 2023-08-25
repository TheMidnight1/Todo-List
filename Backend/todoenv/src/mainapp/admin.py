from django.contrib import admin
from .models import AppUser, Task

# Register your models here.

admin.site.register(AppUser)
admin.site.register(Task)
