from .models import Transition, State, WorkflowGraph, WorkflowInstance
from time import strftime, time, localtime

class WorkflowEngine:
    def __init__(self, workflow_instance, user):
        self.workflow_instance = workflow_instance
        self.user = user
        self.current_state = workflow_instance.state

    # Get all possible transitions from Current State
    def get_valid_transitions(self):
        transitions = Transition.objects.filter(selectWorkflow=self.workflow_instance.workflow).filter(startState=self.current_state)
        return transitions

    # Choices of States to transition to from Current State
    def get_transition_choices(self):
        return [(transition.startState, transition.endState) for transition in self.get_valid_transitions()]

    # Validate Transition based on User permission
    def __validate_transition(self, next_state_pk):
        next_state = State.objects.get(pk=next_state_pk)  # will be used for user permissions
        if self.user.is_superuser:
            return True
        return False

    def is_state_end(self, state):
        if state.stateType == 'End':
            self.workflow_instance.status = True
            self.workflow_instance.history[self.current_state.name] = self.create_history_object
            self.workflow_instance.save()

    @property
    def create_history_object(self):
        return {
                'type':self.current_state.stateType,
                'user':self.user.username,
                'created_time': strftime("%d-%m-%Y %H:%M:%S", localtime(time()))
            }

    # If transition is validated, update workflow current state and move further
    def perform_transition(self, next_state_pk):
        if not self.__validate_transition(next_state_pk):
            return False
        next_state = State.objects.get(pk=next_state_pk)
        self.workflow_instance.state = next_state
        self.workflow_instance.history[self.current_state.name] = self.create_history_object
        self.workflow_instance.save()
        self.current_state = next_state
        return True

    
        

