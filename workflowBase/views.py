from django.contrib import messages
from django.shortcuts import render, redirect 
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import graphviz
# import netwrokx as nx
# import matplotlib.pyplot as plt
from .forms import WorkflowForm, TransitionForm, StatesForm
from .models import Workflow, State, Transition, WorkflowInstance, WorkflowGraph
from .utils import WorkflowEngine

# Create your views here.

# Workflow CRUD views
def workflow(request):
    workflowData = Workflow.objects.all().order_by('-created_at')
    context = {'workflowData': workflowData}
    return render(request, 'pages/workflow/flow/workflow.html', context)


def workflowCreate(request):
    form = WorkflowForm()
    if request.method == 'POST':
        form = WorkflowForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, 'Flow Created Successfully')
            return redirect('workflow:workflow')
    context = {'form': form}
    return render(request, 'pages/workflow/flow/workflowCreate.html', context)


def workflowUpdate(request, pk):
    flowUpdate = Workflow.objects.get(id=pk)
    form = WorkflowForm(instance=flowUpdate)
    if request.method == 'POST':
        form = WorkflowForm(request.POST, instance=flowUpdate)
        if form.is_valid():
            form.save()
            messages.success(request, 'Flow Update Successfully')
            return redirect('workflow:workflow')
    context = {'form': form}
    return render(request, 'pages/workflow/flow/workflowUpdate.html', context)


def workflowDelete(request, pk):
    flow = Workflow.objects.get(id=pk)
    flow.delete()
    return redirect('workflow:workflow')


def workflowDetails(request, pk):
    flowData = Workflow.objects.get(id=pk)
    nodesData = flowData.workflowState.all().order_by('created_at')
    try:
        graph = WorkflowGraph.objects.get(workflow=pk)
        context['graph']= graph
    except:
        print('No Graph found for workflow')
    context = {'flowData': flowData, 'nodesData': nodesData}
    return render(request, 'pages/workflow/flow/workflowDetail.html', context)

def get_state_transition_graph(request,pk): # workflow_instace
    workflow = Workflow.objects.get(id=pk)
    states=State.objects.filter(selectWorkflow=workflow)
    G = graphviz.Digraph(format='png')
    for state in states:
        if state.stateType=='Initial':
            G.node(state.name, shape='circle')
        elif state.stateType=='End':
            G.node(state.name, shape='circle')
        else:
            G.node(state.name, shape='rectangle')
    trans=Transition.objects.filter(selectWorkflow=workflow)
    for tran in trans:
        G.edge(tran.startState.name, tran.endState.name, label=tran.description)
    path=f'workflow/State_Machine_Graph_{workflow.name}.png'
    G.render(path, view=True)
    x=WorkflowGraph.objects.create(workflow=workflow,graph=path)
    x.save()
    return redirect('workflow:detailFlow', pk)

# State Workflow CRUD
def state(request):
    stateData = State.objects.all().order_by('-created_at')
    context = {'stateData': stateData}
    return render(request, 'pages/workflow/states/states.html', context)


def stateCreate(request):
    form = StatesForm()
    if request.method == 'POST':
        form = StatesForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, 'State Created Successfully')
            return redirect('workflow:state')
    context = {'form': form}
    return render(request, 'pages/workflow/states/statesCreate.html', context)


def stateUpdate(request, pk):
    state_Update = State.objects.get(id=pk)
    form = StatesForm(instance=state_Update)
    if request.method == 'POST':
        form = StatesForm(request.POST, instance=state_Update)
        if form.is_valid():
            form.save()
            messages.success(request, 'State Update Successfully')
            return redirect('workflow:state')
    context = {'form': form}
    return render(request, 'pages/workflow/states/statesUpdate.html', context)


def stateDelete(request, pk):
    states = State.objects.get(id=pk)
    states.delete()
    return redirect('workflow:state')


# Transition Workflow CRUD
def transition(request):
    transitData = Transition.objects.all().order_by('-created_at')
    context = {'transitData': transitData}
    return render(request, 'pages/workflow/transition/transition.html', context)


def transitionCreate(request):
    form = TransitionForm()
    if request.method == 'POST':
        form = TransitionForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, 'Transition Created Successfully')
            return redirect('workflow:transition')
    context = {'form': form}
    return render(request, 'pages/workflow/transition/transitionCreate.html', context)


def transitionUpdate(request, pk):
    transition_update = Transition.objects.get(id=pk)
    form = TransitionForm(instance=transition_update)
    if request.method == 'POST':
        form = TransitionForm(request.POST, instance=transition_update)
        if form.is_valid():
            form.save()
            messages.success(request, 'Transition Update Successfully')
            return redirect('workflow:transition')
    context = {'form': form}
    return render(request, 'pages/workflow/transition/transitionUpdate.html', context)


def transitionDelete(request, pk):
    transit = Transition.objects.get(id=pk)
    transit.delete()
    return redirect('workflow:transition')


# Flow Instance
def flowInstance(request, name):
    getId = Workflow.objects.get(name=name)
    data = WorkflowInstance.objects.filter(workflow=getId)
    context = {'data': data}
    return render(request, 'pages/workflow/instance/base.html', context)

@csrf_exempt
def flowInstanceDetails(request, name, instance):
    workflow = Workflow.objects.get(name=name)
    workflowInstance = WorkflowInstance.objects.get(object_id=instance)
    
    data = WorkflowEngine(workflowInstance, request.user)
    data.is_state_end(workflowInstance.state)

    transition_choices = data.get_transition_choices()
    
    if request.method == 'POST':
        # print(request.POST)
        next_state_id = request.POST['nextStateId']
        ret = data.perform_transition(next_state_pk=next_state_id)
        if ret:
            return JsonResponse({
                'message':'State Successfully Changed'
            })
        else:
            return JsonResponse({
                'message':'User not allowed to make Transition'
            })

    context = {
        "workflow": workflow,
        "instance": workflowInstance,
        "transitions": transition_choices
    }
    return render(request, 'pages/workflow/instance/flowDetail.html', context)

