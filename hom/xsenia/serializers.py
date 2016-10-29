from .models import *
from rest_framework import serializers


class StructureSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Structure
        fields = ('name', 'address', 'description', 'total_seats',
                'available_seats', 'active')
