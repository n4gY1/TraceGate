
from django.contrib import admin
from django.urls import path, include

from tracker.views import tracker_view, create_case_view, save_gps_view, list_case_url_view, show_trackers_view, \
    login_view, save_captured_image, js_error, show_captured_images

urlpatterns = [
    path('id/<str:url_id>/', tracker_view, name='tracker_view'),
    path('create/', create_case_view, name='create_case_view'),
    path('',list_case_url_view,name='list_case_url_view'),
    path('show/<int:case_id>/', show_trackers_view, name='show_trackers_view'),
    path('save_gps/',save_gps_view,name='save_gps_view'),
    path('save_captured_image/',save_captured_image,name='save_captured_image'),
    path('show_captured_images/<int:tracker_id>',show_captured_images,name='show_captured_images'),
    path('error/',js_error,name='js_error'),

]