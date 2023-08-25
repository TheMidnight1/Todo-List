import os
import jwt
import json

from .utils import parse_body
from .authenticate import jwt_auth
from .models import AppUser, Task
from django.http import JsonResponse
from django.core import serializers
from django.contrib.auth import authenticate
from django.forms.models import model_to_dict


JWT_SECRET = os.environ.get("JWT_SECRET")


@jwt_auth
def get_current_user(request):
    return JsonResponse({"id": request.user.id, "username": request.user.username})


def respond(body, status=200, safe=True):
    response = JsonResponse(body, safe=safe, content_type="application/json")
    response.status_code = status
    return response


def register_user(request):
    if request.method == "POST":
        body = parse_body(request)

        username = body.get("username")
        password = body.get("password")
        if AppUser.objects.filter(username=username).count():
            return respond(
                {"details": {"username": "username address already in use"}},
                400,
            )
        user = AppUser.objects.create_user(username, password)

        user.save()
        token = jwt.encode({"id": user.id}, JWT_SECRET, algorithm="HS256")

        return respond(
            {
                "user": {
                    "id": user.id,
                    "username": user.username,
                },
                "token": token,
            }
        )
    return respond({"message": "Method not allowed"}, 429)


def login_user(request):
    if request.method == "POST":
        body = parse_body(request)

        username = body.get("username")
        password = body.get("password")
        user = authenticate(username=username, password=password)
        if user is None:
            return respond({"message": "Invalid Credientials"}, 400)

        token = jwt.encode({"id": user.id}, JWT_SECRET, algorithm="HS256")

        return respond(
            {
                "user": {
                    "id": user.id,
                    "username": user.username,
                },
                "token": token,
            }
        )
    return respond({"message": "Method not allowed"}, 429)


@jwt_auth
def show_tasks(request):
    tasks = Task.objects.filter(user_id=request.user.id)
    return respond(serializers.serialize("json", tasks), safe=False)


@jwt_auth
def delete_tasks(request, pk):
    tasks = Task.objects.filter(pk=pk)
    tasks.delete()
    return respond(serializers.serialize("json", tasks), safe=False)


@jwt_auth
def create_tasks(request):
    body = parse_body(request)

    new_task = Task.objects.create(
        title=body.get("title"),
        description=body.get("description"),
        completed=body.get("completed"),
        due_date=body.get("due_date"),
        user=request.user,
    )
    new_task.save()
    return respond(
        {
            "new_task": {
                "pk": new_task.pk,
                "user": new_task.user.pk,
                "title": new_task.title,
                "description": new_task.description,
                "created": new_task.created,
                "completed": new_task.completed,
                "due_date": new_task.due_date,
            }
        }
    )
