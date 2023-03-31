from django.contrib.auth.decorators import login_required
from django.shortcuts import render


# demo one dashboard page
@login_required
def main(request):
    return render(request, 'dashboard/main.html')
