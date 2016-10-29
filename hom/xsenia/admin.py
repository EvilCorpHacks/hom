from django.contrib import admin
from .models import *

# Register your models here.
@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
    pass
@admin.register(Structure)
class StructureAdmin(admin.ModelAdmin):
    pass
@admin.register(Evacuee)
class EvacueeAdmin(admin.ModelAdmin):
    pass
@admin.register(SimpleEvacuee)
class SimpleEvacueeAdmin(admin.ModelAdmin):
    pass
@admin.register(Volunteer)
class VolunteerAdmin(admin.ModelAdmin):
    pass

