import os
import jwt
import functools
from annoying.functions import get_object_or_None
from django.shortcuts import HttpResponse
from django.http import JsonResponse
from .models import AppUser
from django.shortcuts import get_object_or_404


def respond_with_401():
    response = JsonResponse({"message": "Please login"})
    response.status_code = 401  # sample status code
    return response


def jwt_auth(view_func):
    @functools.wraps(view_func)
    def wrapper(request, *args, **kwargs):
        authorization = request.headers.get("Authorization")
        if not authorization:
            return respond_with_401()

        token = authorization.split("Bearer ")
        if len(token) != 2 or not token[1]:
            return respond_with_401()

        data = jwt.decode(token[1], os.environ.get("JWT_SECRET"), algorithms=["HS256"])
        if not data:
            return respond_with_401()

        # user = AppUser.objects.get_object(id=data.get("id"))
        user = get_object_or_None(AppUser, id=data.get("id"))
        if not user:
            return respond_with_401()

        setattr(request, "user", user)
        return view_func(request, *args, **kwargs)

    return wrapper
