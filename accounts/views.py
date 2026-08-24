
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login


# Create your views here.
def login_view(request):
    if request.method == 'POST':
        print("hy login")
        username = request.POST['username']
        password = request.POST['password']
        print(username,password)
        user = authenticate(request, username=username, password=password)
        if user is not None:
            print("hy login","user exist",user)
            print(user.is_authenticated)
            login(request, user)
            return redirect('/')

    template = "accounts/login.html"
    context = {}
    return render(request, template, context)