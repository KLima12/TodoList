from rest_framework import serializers
from .models import Task


class TaskSerialiser(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['id', 'title', 'description', 'deadline_date',
                  'creation_date', 'status', 'status_display']
