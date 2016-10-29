from django.shortcuts import render
from .models import Structure
from rest_framework import viewsets
from xsenia.serializers import StructureSerializer

# Create your views here.
class StructureViewSet(viewsets.ModelViewSet):
    queryset = Structure.objects.all()
    serializer_class = StructureSerializer
