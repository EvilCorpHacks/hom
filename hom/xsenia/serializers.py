from .models import Address, Structure, Evacuee, SimpleEvacuee
from rest_framework import serializers


class AddressSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Address
        fields = ('text', 'phone', 'city', 'state', 'zip_code', 'country',
                  'latitude', 'longitude')


class StructureSerializer(serializers.HyperlinkedModelSerializer):
    address = AddressSerializer()

    class Meta:
        model = Structure
        fields = ('name', 'description', 'total_seats',
                'available_seats', 'active', 'address')

    def create(self, validated_data):
        address_data = validated_data.pop('address')
        address = Address.objects.create(**address_data)
        structure = Structure.objects.create(address=address, **validated_data)
        return structure


class VolunteerSerializer(serializers.HyperlinkedModelSerializer):
    address = AddressSerializer()

    class Meta:
        model = Structure
        fields = ('name', 'surname', 'fiscal_code',
                'note', 'address')

    def create(self, validated_data):
        address_data = validated_data.pop('address')
        address = Address.objects.create(**address_data)
        structure = Structure.objects.create(address=address, **validated_data)
        return structure


class SimpleEvacueeSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = SimpleEvacuee
        fields = ('name', 'surname', 'fiscal_code', 'category')


class EvacueeSerializer(serializers.HyperlinkedModelSerializer):
    group = SimpleEvacueeSerializer()

    class Meta:
        model = Evacuee
        fields = ('name', 'surname', 'fiscal_code', 'category', 'group')
