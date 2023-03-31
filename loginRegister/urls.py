from django.urls import path
from . import views

urlpatterns = [
    path('', views.loginView, name='login'),
    path('sign-in', views.signIn, name='signIn'),
    path('register', views.register, name='register'),
    path('signup', views.signup, name='signup'),
    path('forget-password', views.forgetPassword, name='forget_password'),
    path('sign-out', views.signOut, name='sign_out'),
]