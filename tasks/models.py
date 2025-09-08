from django.db import models
from datetime import date


class Task(models.Model):
    # Define uma classe interna para os possíveis status da tarefa
    class StatusChoices(models.TextChoices):
        # Valor salvo no banco: 'pendente'; valor exibido: 'Pendente'
        PENDING = 'pendente', 'Pendente'
        COMPLETED = 'concluida', 'Concluída'

    title = models.CharField("Título", max_length=100)
    description = models.TextField("Descrição", blank=True)
    deadline_date = models.DateField("Prazo", default=date.today)
    creation_date = models.DateTimeField("Criado em", auto_now_add=True)
    status = models.CharField(
        "Status",
        max_length=20,
        choices=StatusChoices.choices,  # Usa as opções definidas na classe StatusChoices
        default=StatusChoices.PENDING  # Valor padrão: 'pendente'
    )

    # - Cria uma propriedade que retorna o nome legível do status (ex: "Concluída" em vez de "concluida")
    @property
    def status_display(self):
        return self.get_status_display()

    def __str__(self):
        return self.title
