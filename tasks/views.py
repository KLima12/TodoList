from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.shortcuts import render
from rest_framework import status
from .models import Task
from .serializes import TaskSerialiser


@api_view(['GET'])
def view_all_tasks(request):
    tasks = Task.objects.all()
    serializer = TaskSerialiser(tasks, many=True)
    return Response(serializer.data) 


def view_tasks(request):
    return render(request, "view_all_tasks/view_all_tasks.html")
