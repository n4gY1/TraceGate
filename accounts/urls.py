
from django.contrib import admin
from django.urls import path, include

from accounts.views import login_view

urlpatterns = [
    path('', login_view, name='login'),
]