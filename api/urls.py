from django.urls import path

from . import views

app_name = 'api'

urlpatterns = [
    #API urls for workflow
    path('workflow/', views.api_workflow, name='api_workflow'),
    path('workflow/create/', views.api_workflow_create, name='api_workflowcreate'),
    path('workflow/update/<int:pk>/', views.api_workflow_update, name='api_workflowupdate'),
    path('workflow/delete/<int:pk>/', views.api_workflow_delete, name='api_workflowdelete'),
]
