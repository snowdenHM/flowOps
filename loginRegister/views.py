from django.shortcuts import render, redirect
from .forms import AuthForm
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from .decorators import anonymous_required
from django.contrib.auth.decorators import login_required


# show login page
@anonymous_required
def loginView(request):
    return render(request, 'auth/login.html')


# sign in user
@anonymous_required
def signIn(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect('dashboard:main')
        else:
            return redirect('/')


# show register page
@anonymous_required
def register(request):
    return render(request, 'auth/register.html')


# sign user up
@anonymous_required
def signup(request):
    if request.method == 'POST':
        form = AuthForm(request.POST)
        if form.is_valid():
            user = User.objects.create_user(
                first_name=request.POST['first_name'],
                last_name=request.POST['last_name'],
                username=request.POST['username'],
                email=request.POST['email'],
                password=request.POST['password']
            )
            login(request, user)
            return redirect('dashboard:main')
        else:
            return render(request, 'auth/register.html', {'form': form})
    return redirect('register')


# show forget password page
@anonymous_required
def forgetPassword(request):
    return render(request, 'auth/forget.html')


# logout
@login_required
def signOut(request):
    logout(request)
    return redirect('login')
