from django.contrib import admin

from tracker.models import Case, Tracker, CameraCapture


# Register your models here.
class CaseAdmin(admin.ModelAdmin):
    list_display = ["case_number",'owner',"url_id","created","description"]

class TrackerAdmin(admin.ModelAdmin):
    list_display = ["case__case_number","created","ip_address","x_forwarded_for","accuracy"]

class CameraCaptureAdmin(admin.ModelAdmin):
    list_display = ["case__case_number", "created", "photo"]


admin.site.register(Tracker,TrackerAdmin)
admin.site.register(Case,CaseAdmin)
admin.site.register(CameraCapture,CameraCaptureAdmin)