import requests

from datetime import datetime
from functools import reduce

from django.db import models
from django.contrib.auth.models import User
from django.db.models import Model, fields

API_KEY = 'AIzaSyChDSGvnNPK8WVAE66y_X-EJgvgcqg5GMg'


class Address(Model):
    text = fields.CharField(max_length=50, blank=True, null=True)
    phone = fields.CharField(max_length=15, blank=True, null=True)
    city = fields.CharField(max_length=50, blank=True, null=True)
    state = fields.CharField(max_length=50, blank=True, null=True)
    zip_code = fields.CharField(max_length=10, blank=True, null=True)
    country = fields.CharField(max_length=50, blank=True, null=True)
    latitude = fields.FloatField(blank=True, null=True)
    longitude = fields.FloatField(blank=True, null=True)

    def save(self, *args, **kwargs):
        res = requests.get(
            'https://maps.googleapis.com/maps/api/geocode/json?address={},{},{},{}&key={}'.
            format(self.text, self.city, self.country, self.zip_code, API_KEY))
        location = res.json()['results'][0]['geometry']['location']
        self.latitude = location['lat']
        self.longitude = location['lng']
        super().save(*args, **kwargs)


class Volunteer(Model):
    name = fields.CharField(max_length=50, blank=True, null=True)
    surname = fields.CharField(max_length=50, blank=True, null=True)
    fiscal_code = fields.CharField(max_length=20, blank=True, null=True)
    note = fields.CharField(max_length=200, blank=True, null=True)
    address = models.ForeignKey(Address, blank=True, null=True)


class Structure(Model):
    name = fields.CharField(max_length=50, blank=True, null=True)
    address = models.ForeignKey(Address, blank=True, null=True)
    description = fields.CharField(max_length=250, blank=True, null=True)
    total_seats = fields.IntegerField(blank=True, null=True)
    available_seats = fields.IntegerField(blank=True, null=True)
    active = fields.BooleanField(default=True)
    owner = models.ForeignKey(Volunteer, blank=True, null=True)

    def update_availability(self):
        occupied_sits = 0
        for evacuee in self.evacuees.all():
            occupied_sits += evacuee.group_size
        self.available_seats = self.total_seats - occupied_sits
        self.save()


class Evacuee(Model):
    name = fields.CharField(max_length=50, blank=True, null=True)
    surname = fields.CharField(max_length=50, blank=True, null=True)
    fiscal_code = fields.CharField(max_length=20, blank=True, null=True)
    category = fields.CharField(max_length=20, blank=True, null=True)
    note = fields.CharField(max_length=200, blank=True, null=True)
    address = models.ForeignKey(Address, blank=True, null=True)
    user = models.ForeignKey(
        User, related_name='profile', blank=True, null=True)
    assigned_structure = models.ForeignKey(
        Structure, related_name='evacuees', blank=True, null=True)
    assigned_time = fields.DateTimeField(blank=True, null=True)

    @property
    def is_assigned(self):
        return self.assigned_structure is not None

    @property
    def group_size(self):
        return 1 + self.group.count()

    def assign_structure(self, structure):
        self.assigned_structure = structure
        self.assigned_time = datetime.now()
        self.save()
        structure.update_availability()


class SimpleEvacuee(Model):
    name = fields.CharField(max_length=50, blank=True, null=True)
    surname = fields.CharField(max_length=50, blank=True, null=True)
    fiscal_code = fields.CharField(max_length=20, blank=True, null=True)
    category = fields.CharField(max_length=20, blank=True, null=True)
    note = fields.CharField(max_length=200, blank=True, null=True)
    leader = models.ForeignKey(
        Evacuee, related_name='group', blank=True, null=True)
    address = models.ForeignKey(Address, blank=True, null=True)


class Notification(Model):
    time = fields.DateTimeField(blank=True, null=True)
    message = fields.TextField(blank=True, null=True)
    readed = fields.BooleanField(default=False)
    kind = fields.CharField(
        max_length=50, blank=True, null=True)  # Expected: hazard, assignment
    user = models.ForeignKey(User, blank=True, null=True)

    def mark_as_read(self):
        self.readed = True
        self.save()
