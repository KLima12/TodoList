from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.shortcuts import render
from rest_framework import status
from rest_framework import generics
from .models import Task
from .serializers import TaskSerialiser


# @api_view(['GET'])
# def view_all_tasks(request):
#     tasks = Task.objects.all()
#     serializer = TaskSerialiser(tasks, many=True)
#     return Response(serializer.data)

class TaskListApiView(generics.ListCreateAPIView):
    """
    API View para listar todas as tarefas e criar tarefas;
    Esta classe lida automaticamente com requisições GET e POST.
    """
    #  Diz à view qual conjunto de dados ela deve usar (neste caso, todas as tarefas).
    queryset = Task.objects.all()
    # Diz à view qual serializer usar para converter os objetos Task em JSON.
    serializer_class = TaskSerialiser


class TaskDetailApiView(generics.RetrieveUpdateDestroyAPIView):
    """
    API View para buscar (GET), atualizar (PUT/PATCH) ou deletar (DELETE) uma tarefa específica.
    """
    queryset = Task.objects.all()
    serializer_class = TaskSerialiser
    lookup_field = 'id'  # Informa ao DRF para usar o 'id' da URL para buscar o objeto


@api_view(['GET'])
def tasks_complete(request):
    task = Task.objects.filter(status="concluida")
    serializer = TaskSerialiser(task, many=True)
    return Response(serializer.data)


def view_tasks(request):
    task = Task.objects.all()
    context = {
        "status_choices": Task.StatusChoices.choices
    }
    return render(request, "view_all_tasks/view_all_tasks.html", context)
