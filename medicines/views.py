from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated


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
    permission_classes = [IsAuthenticated]


class MedicineScheduleViewSet(viewsets.ModelViewSet):
    queryset = MedicineSchedule.objects.all()
    serializer_class = MedicineScheduleSerializer
    permission_classes = [IsAuthenticated]


class MedicineLogViewSet(viewsets.ModelViewSet):
    queryset = MedicineLog.objects.all()
    serializer_class = MedicineLogSerializer
    permission_classes = [IsAuthenticated]