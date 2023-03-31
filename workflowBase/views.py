from django.shortcuts import render


# Create your views here.
def workflow(request):
    return render(request, 'pages/workflow/flow/workflow.html')

def state(request):
    return render(request, 'pages/workflow/states/states.html')

def transition(request):
    return render(request, 'pages/workflow/transition/transition.html')