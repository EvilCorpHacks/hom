from django.contrib.auth.models import User, Group
from rest_framework import serializers
from .models import Address, Structure, Volunteer, Evacuee, SimpleEvacuee, Notification


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ('id', 'name')


class UserSerializer(serializers.HyperlinkedModelSerializer):
    groups = GroupSerializer(many=True)
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'groups')


class AddressSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Address
        fields = ('id', 'text', 'phone', 'city', 'state', 'zip_code',
                  'country', 'latitude', 'longitude')


class StructureSerializer(serializers.HyperlinkedModelSerializer):
    address = AddressSerializer()

    class Meta:
        model = Structure
        fields = ('id', 'name', 'description', 'total_seats',
                  'available_seats', 'active', 'address', 'owner_id')

    def create(self, validated_data):
        address_data = validated_data.pop('address')
        address = Address.objects.create(**address_data)
        structure = Structure.objects.create(address=address, **validated_data)
        return structure


class VolunteerSerializer(serializers.HyperlinkedModelSerializer):
    address = AddressSerializer()

    class Meta:
        model = Volunteer
        fields = ('id', 'name', 'surname', 'fiscal_code', 'note', 'address')

    def create(self, validated_data):
        address_data = validated_data.pop('address')
        address = Address.objects.create(**address_data)
        volunteer = Volunteer.objects.create(address=address, **validated_data)
        return volunteer


class SimpleEvacueeSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = SimpleEvacuee
        fields = ('id', 'name', 'surname', 'fiscal_code', 'category')


class EvacueeSerializer(serializers.HyperlinkedModelSerializer):
    group = SimpleEvacueeSerializer(many=True)
    assigned_structure = StructureSerializer()

    class Meta:
        model = Evacuee
        fields = ('id', 'name', 'surname', 'fiscal_code', 'category', 'group',
                'assigned_structure')

    def create(self, validated_data):
        group_list = validated_data.pop('group')
        evacuee = Evacuee.objects.create(**validated_data)
        group = []
        for item in group_list:
            item['leader'] = evacuee
            group.append(SimpleEvacuee.objects.create(**item))
        return evacuee


class NotificationSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Notification
        fields = ('id', 'time', 'message', 'readed', 'kind', 'user_id')
