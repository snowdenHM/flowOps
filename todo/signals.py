from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Todo
from workflowBase.models import WorkflowInstance, Workflow, State

@receiver(post_save, sender=Todo)
def initiate_workflow_instance(sender, instance, created, **kwargs):
    if created:
        mail = Workflow.objects.get(name='Mail')
        start_state = State.objects.get(selectWorkflow=mail, stateType='Initial')
        print(start_state)
        workflow_instance = WorkflowInstance.objects.create(workflow=mail,
                                                            state=start_state,
                                                            object_id=instance.id,
                                                            content_object=instance)
        workflow_instance.save()