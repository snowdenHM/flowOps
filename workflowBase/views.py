from django.contrib import messages
from django.shortcuts import render, redirect

from .forms import WorkflowForm, TransitionForm, StatesForm
from .models import Workflow, State, Transition, WorkflowInstance
from .utils import WorkflowEngine

# Create your views here.

# Workflow CRUD views
def workflow(request):
    workflowData = Workflow.objects.all().order_by('-created_at')
    context = {'workflowData': workflowData}
    # inst = WorkflowInstance.objects.first()
    # data = WorkflowEngine(inst)
    # print(data.workflow_instance)
    # print(data.current_state)
    # print(data.workflow)
    # trans = data.get_transition_choices()
    # print(trans)
    # start_state = State.objects.get(id=trans[0][0])
    # end_state = State.objects.get(id=trans[0][1])
    # data.perform_transition(trans[0][1])
    # print(f'Start: {start_state}\nEnd: {end_state}')
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
    context = {'flowData': flowData, 'nodesData': nodesData}
    return render(request, 'pages/workflow/flow/workflowDetail.html', context)


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


def flowInstanceDetails(request):
    context = {}
    return render(request, 'pages/workflow/instance/flowDetail.html', context)
