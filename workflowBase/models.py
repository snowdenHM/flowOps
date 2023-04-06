import uuid

from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.db import models


# from django.contrib.auth.models import User, Group, Permission


class WorkflowBase(models.Model):
    id = models.UUIDField(default=uuid.uuid4, unique=True, primary_key=True, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Workflow(WorkflowBase):
    name = models.CharField(max_length=255)
    is_deploy = models.BooleanField(default=False)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Workflow"
        verbose_name_plural = "Workflows"


class State(WorkflowBase):
    stateChoices = [
        ('Initial', 'Initial'),
        ('End', 'End'),
        ('Flow', 'Flow'),
    ]
    name = models.CharField(max_length=255) # MAKE UNIQUE
    selectWorkflow = models.ForeignKey(Workflow, on_delete=models.CASCADE, related_name='workflowState')
    stateType = models.CharField(choices=stateChoices, max_length=20, default='Flow')

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "State"
        verbose_name_plural = "States"


class Transition(WorkflowBase):
    selectWorkflow = models.ForeignKey(Workflow, on_delete=models.CASCADE, related_name='workflowTransition')
    startState = models.ForeignKey(State, on_delete=models.CASCADE, related_name="transitionStartState")
    endState = models.ForeignKey(State, on_delete=models.CASCADE, related_name="transitionEndState")
    description = models.CharField(max_length=255, default='')

    def __str__(self):
        return self.startState.name + ' ---> ' + self.endState.name

    class Meta:
        verbose_name = "Transition"
        verbose_name_plural = "Transitions"


class TransitionEvents(WorkflowBase):
    eventChoices = [
        ('Mail', 'Mail'),
        ('SMS', 'SMS'),
    ]
    name = models.CharField(choices=eventChoices, max_length=20)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Transition Event"
        verbose_name_plural = "Transition Events"


class WorkflowInstance(WorkflowBase):
    workflow = models.ForeignKey(Workflow, on_delete=models.CASCADE)
    state = models.ForeignKey(State, on_delete=models.CASCADE)
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey('content_type', 'object_id')
    status = models.BooleanField(default=False, null=True, blank=True)
    history = models.JSONField(default=dict, null=True, blank=True)

    def __str__(self):
        return f'{self.workflow.name} - {self.content_object}'


class WorkflowGraph(WorkflowBase):
    workflow = models.ForeignKey(Workflow, on_delete=models.CASCADE)
    graph = models.FileField(upload_to='workflow/', null=True, blank=True)

    def __str__(self):
        return self.workflow.name

    class Meta:
        verbose_name = "Workflow Graph"
        verbose_name_plural = "Workflow Graphs"