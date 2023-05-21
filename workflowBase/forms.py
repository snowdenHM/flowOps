from django.forms import ModelForm
from django import forms
from .models import Workflow, State, Transition, TransitionEvents
class WorkflowForm(ModelForm):
    class Meta:
        model = Workflow
        fields = "__all__"


class StatesForm(ModelForm):
    class Meta:
        model = State
        fields = "__all__"


class TransitionForm(ModelForm):
    startStateId = forms.CharField(widget=forms.HiddenInput(), required=False)
    endStateId = forms.CharField(widget=forms.HiddenInput(), required=False)

    class Meta:
        model = Transition
        fields = "__all__"
        # exclude=['selectWorkflow']

class TransitionEventsForm(ModelForm):
    class Meta:
        model = TransitionEvents
        fields = "__all__"