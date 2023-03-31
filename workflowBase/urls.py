from django.urls import path

from . import views

app_name = 'workflow'

urlpatterns = [
    path('flow/', views.workflow, name='workflow'),
    path('state/', views.state, name='state'),
    path('transition/', views.transition, name='transition'),
]
