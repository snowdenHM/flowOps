from .models import Workflow


def menu_items(request):
    items = Workflow.objects.filter(is_deploy=True)
    return {'menu_items': items}
