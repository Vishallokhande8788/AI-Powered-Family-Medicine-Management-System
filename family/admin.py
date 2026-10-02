
from django.contrib import admin
from .models import (
    FamilyMember,
    MedicalHistory,
    Doctor,
    MedicalDocument,
    VitalRecord,
)

admin.site.register(FamilyMember)
admin.site.register(MedicalHistory)
admin.site.register(Doctor)
admin.site.register(MedicalDocument)
admin.site.register(VitalRecord)