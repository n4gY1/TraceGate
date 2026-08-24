import uuid

from django.contrib.auth.models import User
from django.db import models

# Create your models here.
class Tracker(models.Model):
    case = models.ForeignKey('Case', on_delete=models.CASCADE)
    created = models.DateTimeField(auto_now_add=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    x_forwarded_for = models.TextField(null=True, blank=True)
    user_agent = models.TextField(null=True, blank=True)
    referer = models.TextField(null=True, blank=True)

    browser = models.CharField(max_length=100, null=True, blank=True)
    platform = models.CharField(max_length=100, null=True, blank=True)
    mobile = models.CharField(max_length=100, null=True, blank=True)

    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    accuracy = models.IntegerField(null=True, blank=True)
    timestamp = models.IntegerField(blank=True, null=True)



class CameraCapture(models.Model):
    tracker = models.ForeignKey('Tracker', on_delete=models.CASCADE,null=True, blank=True,related_name="get_camera_captures")
    created = models.DateTimeField(auto_now_add=True)
    photo = models.ImageField(upload_to='camera_captures', null=True, blank=True)


class Case(models.Model):
    url_id = models.UUIDField(default=uuid.uuid4, editable=False)
    case_number = models.CharField(max_length=50, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    created = models.DateTimeField(auto_now_add=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    redirect_url = models.CharField(max_length=200, null=True, blank=True)
