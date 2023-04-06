from .models import Transition, State, WorkflowGraph, WorkflowInstance


class WorkflowEngine:
    def __init__(self, workflow_instance):
        self.workflow_instance = workflow_instance
        self.current_state = workflow_instance.state
        self.workflow = workflow_instance.workflow

    @staticmethod
    def get_current_user(user):
        return user

    # Get all possible transitions from Current State
    def get_valid_transitions(self):
        transitions = Transition.objects.filter(selectWorkflow=self.workflow).filter(startState=self.current_state)
        return transitions

    # Choices of States to transition to from Current State
    def get_transition_choices(self):
        return [(transition.startState, transition.endState) for transition in self.get_valid_transitions()]

    # Validate Transition based on User permission
    # def __validate_transition(self, next_state_pk):
    #     next_state = State.objects.get(pk=next_state_pk)  # will be used for user permissions
    #     if self.current_state.stateType == 'End':
    #         self.workflow_instance.status = True
    #         self.workflow_instance.save()
    #         return False
    #     return True

    def is_state_end(self, state):
        if state.stateType == 'End':
            self.workflow_instance.status = True
            self.workflow_instance.save()

    # If transition is validated, update workflow current state and move further
    def perform_transition(self, next_state_pk):
        next_state = State.objects.get(pk=next_state_pk)
        self.workflow_instance.state = next_state
        self.workflow_instance.history[self.current_state.name] = next_state.name
        self.workflow_instance.save()
        self.current_state = next_state

    
        

