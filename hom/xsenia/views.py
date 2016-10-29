from django.shortcuts import render
from .models import Structure
from rest_framework import viewsets
from xsenia.serializers import StructureSerializer

# Create your views here.
class StructureViewSet(viewsets.ModelViewSet):
    queryset = Structure.objects.all()
    serializer_class = StructureSerializer

    def get_queryset(self):
        """
        Optionally restricts the returned purchases to a given user,
        by filtering against a `username` query parameter in the URL.
        """
        queryset = self.queryset()
        user = self.request.query_params.get('user', None)
        if user is not None:
            queryset = queryset.filter(structure__user=user)
        return queryset