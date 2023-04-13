from django.shortcuts import render
from .serializers import WorkflowSerializer
from rest_framework.response import Response
from rest_framework.decorators import api_view
from workflowBase.models  import Workflow
from rest_framework import status
# Create your views here.
# API for workflow CRUD
@api_view(['GET'])
def api_workflow(request):
    workflows = Workflow.objects.all()
    serializer = WorkflowSerializer(workflows, many=True)
    return Response(serializer.data)

@api_view(['GET', 'POST'])
def api_workflow_create(request):
    serializer = WorkflowSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET','PUT'])
def api_workflow_update(request, pk):
    try:
        workflow = Workflow.objects.get(pk=pk)
    except Workflow.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    serializer = WorkflowSerializer(workflow, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def api_workflow_delete(request, pk):
    try:
        workflow = Workflow.objects.get(pk=pk)
    except Workflow.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    workflow.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


