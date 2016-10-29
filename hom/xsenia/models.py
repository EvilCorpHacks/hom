from django.db import models
from django.contrib.auth.models import User
from django.db.models import Model, fields
from datetime import datetime
from functools import reduce


class Address(Model):
    text = fields.CharField(max_length=50)
    phone = fields.CharField(max_length=15)
    city = fields.CharField(max_length=50)
    state = fields.CharField(max_length=50)
    zip_code = fields.CharField(max_length=10)
    country = fields.CharField(max_length=50)
    latitude = fields.FloatField()
    longitude = fields.FloatField()


class Structure(Model):
    name = fields.CharField(max_length=50)
    address = models.ForeignKey(Address)
    description = fields.CharField(max_length=250)
    total_seats = fields.IntegerField()
    available_seats = fields.IntegerField()
    active = fields.BooleanField()

    def update_availability(self):
        self.available_seats = self.total_seats - reduce(
            lambda n, l: n + l.group_size, self.evacuees
        )


class Evacuee(Model):
    name = fields.CharField(max_length=50)
    surname = fields.CharField(max_length=50)
    fiscal_code = fields.CharField(max_length=20)
    category = fields.CharField(max_length=20)
    note = fields.CharField(max_length=200)
    address = models.ForeignKey(Address)
    user = models.ForeignKey(User, related_name='profile')
    assigned_structure = models.ForeignKey(Structure, related_name='evacuees')
    assigned_time = fields.DateTimeField()

    @property
    def is_assigned(self):
        return self.assigned_structure is not None

    @property
    def group_size(self):
        return 1 + len(self.group)

    def assign_structure(self, structure):
        self.assign_structure = structure
        self.assigned_time = datetime.now()
        self.save()


class SimpleEvacuee(Model):
    name = fields.CharField(max_length=50)
    surname = fields.CharField(max_length=50)
    fiscal_code = fields.CharField(max_length=20)
    category = fields.CharField(max_length=20)
    note = fields.CharField(max_length=200)
    leader = models.ForeignKey(Evacuee, related_name='group')
    address = models.ForeignKey(Address)


class Volunteer(Model):
    name = fields.CharField(max_length=50)
    surname = fields.CharField(max_length=50)
    fiscal_code = fields.CharField(max_length=20)
    note = fields.CharField(max_length=200)
    address = models.ForeignKey(Address)


class Notification(Model):
    time = fields.DateTimeField()
    message = fields.TextField()
    readed = fields.BooleanField(default=False)
    type = fields.CharField(max_length=50)  # Expected: hazard, assignment
    user = models.ForeignKey(User)

    def mark_as_read(self):
        self.readed = True
        self.save()
