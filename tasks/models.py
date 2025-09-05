from django.db import models
from datetime import date


class Task(models.Model):
    class StatusChoices(models.TextChoices):
        PENDING = 'pendente', 'Pendente'
        COMPLETED = 'concluida', 'Concluída'

    title = models.CharField("Título", max_length=100)
    description = models.TextField("Descrição", blank=True)
    deadline_date = models.DateField("Prazo", default=date.today)
    creation_date = models.DateTimeField("Criado em", auto_now_add=True)
    status = models.CharField(
        "Status",
        max_length=20,
        choices=StatusChoices.choices,
        default=StatusChoices.PENDING
    )

    def __str__(self):
        return self.title
