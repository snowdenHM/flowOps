from .models import Transition, State


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
        return [(transition.startState.pk, transition.endState.pk) for transition in self.get_valid_transitions()]

    # Validate Transition based on User permission
    def __validate_transition(self, next_state_pk):
        next_state = State.objects.get(pk=next_state_pk)  # will be used for user permissions
        if self.current_state.type == 'End':
            self.workflow_instance.status = True
            self.workflow_instance.save()
            return False
        return True

    # If transition is validated, update workflow current state and move further
    def perform_transition(self, next_state_pk):
        if not self.__validate_transition(next_state_pk):
            raise Exception('Transition is invalid')
        next_state = State.objects.get(pk=next_state_pk)
        self.workflow_instance.state = next_state
        self.workflow_instance.history[self.current_state] = next_state
        self.workflow_instance.save()
        self.current_state = next_state

# class WorkflowEngine:
#     def __init__(self, workflow_instance):
#         self.workflow_instance = workflow_instance
#
#     def can_transition_to_state(self, to_state):
#         # Check if the user has permission to transition to the to_state
#         user = self.get_current_user()
#         permission = self.get_workflow_permission(user)
#         if to_state not in permission.can_transition_to.all():
#             return False
#
#         # Check if there is a valid transition from the current state to the to_state
#         transitions = Transition.objects.filter(from_state=self.workflow_instance.state, to_state=to_state)
#         if not transitions:
#             return False
#
#         return True
#
#     def get_current_user(self):
#         # TODO: implement function to get current user
#         pass
#
#     def get_workflow_permission(self, user):
#         # Get the workflow permission for the user and workflow instance
#         permission = WorkflowPermission.objects.get(user=user, workflow=self.workflow_instance.workflow)
#         return permission
#
#     def get_valid_transitions(self):
#         # Get all valid transitions for the current state and current user
#         user = self.get_current_user()
#         permission = self.get_workflow_permission(user)
#         transitions = Transition.objects.filter(from_state=self.workflow_instance.state,
#                                                 to_state__in=permission.can_transition_to.all())
#         return transitions
#
#     def transition_to_state(self, to_state):
#         # Check if transition is valid
#         if not self.can_transition_to_state(to_state):
#             return False
#
#         # Update the workflow instance with the new state
#         self.workflow_instance.state = to_state
#         self.workflow_instance.save()
#
#         return True

# A---> Initial State--
# A--> B /// A--> C  [A--> B] [ User Permission, Transition Events, Logging, Workflow Instance Update]
