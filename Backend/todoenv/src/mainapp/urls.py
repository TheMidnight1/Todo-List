from django.urls import path, include
from .views import (
    get_current_user,
    register_user,
    login_user,
    show_tasks,
    create_tasks,
    delete_tasks,
)

urlpatterns = [
    path("auth/currentuser/", get_current_user),
    path("auth/register/", register_user),
    path("auth/login/", login_user),
    path("tasks/", show_tasks),
    path("tasks/create", create_tasks),
    path("tasks/delete/<int:pk>", delete_tasks),
]
