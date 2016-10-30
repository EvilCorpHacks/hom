from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth.models import User, Group
from .models import Structure, Volunteer, Evacuee, SimpleEvacuee, Notification
from rest_framework import viewsets
from xsenia.serializers import StructureSerializer, VolunteerSerializer, EvacueeSerializer, NotificationSerializer, UserSerializer, GroupSerializer
from django.views.decorators.csrf import csrf_exempt
import json


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer

    def get_queryset(self):
        """
        Optionally restricts the returned purchases to a given user,
        by filtering against a `username` query parameter in the URL.
        """
        queryset = self.queryset
        user = self.request.query_params.get('user', None)
        if user is not None:
            queryset = queryset.filter(username=user)
        return queryset

class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Group.objects.all()
    serializer_class = GroupSerializer


# Create your views here.
class StructureViewSet(viewsets.ModelViewSet):
    queryset = Structure.objects.all()
    serializer_class = StructureSerializer

    def get_queryset(self):
        """
        Optionally restricts the returned purchases to a given structure
        by filtering against a `user` id query parameter in the URL.
        """
        queryset = Structure.objects.all()
        user = self.request.query_params.get('user', None)
        if user is not None:
            queryset = queryset.filter(structure__user=user)
        return queryset


class VolunteerViewSet(viewsets.ModelViewSet):
    queryset = Volunteer.objects.all()
    serializer_class = VolunteerSerializer


class EvacueeViewSet(viewsets.ModelViewSet):
    queryset = Evacuee.objects.all()
    serializer_class = EvacueeSerializer


class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer

    def get_queryset(self):
        """
        Optionally restricts the returned purchases to a given structure
        by filtering against a `structure` id query parameter in the URL.
        """
        queryset = Notification.objects.all()
        user = self.request.query_params.get('user', None)
        if user is not None:
            queryset = queryset.filter(user_id=user)
        return queryset


@csrf_exempt
def assign_view(request):
    res = HttpResponse()
    try:
        data = json.loads(request.body.decode('utf8'))
        structure = Structure.objects.get(pk=data['structure_id'])
        Evacuee.objects.get(pk=data['evacuee_id']).assign_structure(structure)
        res.status_code = 200
    except Exception:
        res.status_code = 400
    return res
