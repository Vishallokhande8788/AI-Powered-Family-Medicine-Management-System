from rest_framework import viewsets

from .models import (
    Medicine,
    MedicineSchedule,
    MedicineLog,
)

from .serializers import (
    MedicineSerializer,
    MedicineScheduleSerializer,
    MedicineLogSerializer,
)


class MedicineViewSet(viewsets.ModelViewSet):
    queryset = Medicine.objects.all()
    serializer_class = MedicineSerializer


class MedicineScheduleViewSet(viewsets.ModelViewSet):
    queryset = MedicineSchedule.objects.all()
    serializer_class = MedicineScheduleSerializer


class MedicineLogViewSet(viewsets.ModelViewSet):
    queryset = MedicineLog.objects.all()
    serializer_class = MedicineLogSerializer