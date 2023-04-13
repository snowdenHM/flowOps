from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('loginRegister.urls')),
    path('dashboard/', include('dashboard.urls', namespace='dashboard')),
    path('workflow/', include('workflowBase.urls', namespace='workflow')),
    path('api/', include('api.urls', namespace='api'))

]
