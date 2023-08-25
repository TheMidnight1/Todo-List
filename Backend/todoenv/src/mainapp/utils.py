import json


def parse_body(request):
    try:
        content_type = request.content_type
        print(content_type)
        if content_type == "application/json":
            data = json.loads(request.body)
        elif (
            content_type == "application/x-www-form-urlencoded"
            or content_type == "multipart/form-data"
        ):
            # If using form data, you can use the POST dictionary
            data = request.POST
        else:
            data = None  # Unsupported content type

        return data

    except json.JSONDecodeError:
        return None  # Unable to parse JSON data
