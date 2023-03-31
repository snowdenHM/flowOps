from django.contrib import admin

from .models import Workflow, State, Transition, TransitionEvents

# Register your models here.

admin.site.register(Workflow)
admin.site.register(State)
admin.site.register(Transition)
admin.site.register(TransitionEvents)
