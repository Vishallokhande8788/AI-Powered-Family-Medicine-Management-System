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

    def get_queryset(self):
        return Medicine.objects.filter(
            family_member__user=self.request.user
        )

    def perform_create(self, serializer):
        family_member = serializer.validated_data["family_member"]

        if family_member.user != self.request.user:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied(
                "You can only add medicines for your own family members."
            )

        serializer.save()

class MedicineScheduleViewSet(viewsets.ModelViewSet):
    queryset = MedicineSchedule.objects.all()
    serializer_class = MedicineScheduleSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return MedicineSchedule.objects.filter(
            medicine__family_member__user=self.request.user
        )

    def perform_create(self, serializer):
        medicine = serializer.validated_data["medicine"]

        if medicine.family_member.user != self.request.user:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied(
                "You can only add schedules for your own medicines."
            )

        serializer.save()

class MedicineLogViewSet(viewsets.ModelViewSet):
    queryset = MedicineLog.objects.all()
    serializer_class = MedicineLogSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return MedicineLog.objects.filter(
            schedule__medicine__family_member__user=self.request.user
        )

    def perform_create(self, serializer):
        schedule = serializer.validated_data["schedule"]

        if schedule.medicine.family_member.user != self.request.user:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied(
                "You can only add logs for your own medicine schedules."
            )

        serializer.save()