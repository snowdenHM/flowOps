from django.forms import ModelForm
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
    class Meta:
        model = Transition
        fields = "__all__"

class TransitionEventsForm(ModelForm):
    class Meta:
        model = TransitionEvents
        fields = "__all__"