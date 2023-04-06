from django.urls import path

from . import views

app_name = 'workflow'

urlpatterns = [
    # Flow CRUD
    path('flow/', views.workflow, name='workflow'),
    path('createFlow/', views.workflowCreate, name='createFlow'),
    path('updateFlow/<str:pk>/', views.workflowUpdate, name='updateFlow'),
    path('deleteFlow/<str:pk>/', views.workflowDelete, name='deleteFlow'),
    path('detailFlow/<str:pk>/', views.workflowDetails, name='detailFlow'),
    path('generateGraph/<str:pk>/', views.get_state_transition_graph, name='generateGraph'),

    # State CRUD
    path('state/', views.state, name='state'),
    path('createState/', views.stateCreate, name='createState'),
    path('updateState/<str:pk>/', views.stateUpdate, name='updateState'),
    path('deleteState/<str:pk>/', views.stateDelete, name='deleteState'),

    # Transition CRUD
    path('transition/', views.transition, name='transition'),
    path('createTransition/', views.transitionCreate, name='createTransition'),
    path('updateTransition/<str:pk>/', views.transitionUpdate, name='updateTransition'),
    path('deleteTransition/<str:pk>/', views.transitionDelete, name='deleteTransition'),

    # Workflow Instance
    path('flows/<str:name>/', views.flowInstance, name='flowInstance'),
    path('flows/<str:name>/<str:instance>/', views.flowInstanceDetails, name='flowInstanceDetails')

]
