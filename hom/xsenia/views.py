from django.shortcuts import render
from .models import Structure, Volunteer, Evacuee, SimpleEvacuee
from rest_framework import viewsets
from xsenia.serializers import StructureSerializer, VolunteerSerializer

# Create your views here.
class StructureViewSet(viewsets.ModelViewSet):
    queryset = Structure.objects.all()
    serializer_class = StructureSerializer

    def get_queryset(self):
        """
        Optionally restricts the returned purchases to a given user,
        by filtering against a `username` query parameter in the URL.
        """
        queryset = self.queryset
        user = self.request.query_params.get('user', None)
        if user is not None:
            queryset = queryset.filter(structure__user=user)
        return queryset


class VolunteerSerializer(viewsets.ModelViewSet):
    queryset = Volunteer.objects.all()
    serializer_class = VolunteerSerializer


class EvacueeSerializer(viewsets.ModelViewSet):
    queryset = Evacuee.objects.all()
    serializer_class = EvacueeSerializer
