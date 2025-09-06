from django.urls import path
from . import views
urlpatterns = [
    path('', views.TaskListApiView.as_view(), name="api-view"),
    path('view_tasks/', views.view_tasks, name="view-tasks"),
]
