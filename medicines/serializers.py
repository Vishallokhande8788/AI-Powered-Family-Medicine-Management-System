from rest_framework import serializers

from .models import (
    Medicine,
    MedicineSchedule,
    MedicineLog,
)


class MedicineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medicine
        fields = "__all__"


class MedicineScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = MedicineSchedule
        fields = "__all__"


class MedicineLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = MedicineLog
        fields = "__all__"