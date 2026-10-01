from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import Medicine, MedicineSchedule, MedicineLog

admin.site.register(Medicine)
admin.site.register(MedicineSchedule)
admin.site.register(MedicineLog)