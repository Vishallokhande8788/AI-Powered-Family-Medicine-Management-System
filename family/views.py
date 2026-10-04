from django.shortcuts import render
from rest_framework.permissions import IsAuthenticated
# Create your views here.
from rest_framework import viewsets

from .models import (
    FamilyMember,
    MedicalHistory,
    Doctor,
    MedicalDocument,
    VitalRecord,
    MedicalClaim,

)

from .serializers import (
    FamilyMemberSerializer,
    MedicalHistorySerializer,
    DoctorSerializer,
    MedicalDocumentSerializer,
    VitalRecordSerializer,
    MedicalClaimSerializer,

)

class FamilyMemberViewSet(viewsets.ModelViewSet):
    queryset = FamilyMember.objects.all()
    serializer_class = FamilyMemberSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return FamilyMember.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class MedicalHistoryViewSet(viewsets.ModelViewSet):
    queryset = MedicalHistory.objects.all()
    serializer_class = MedicalHistorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return MedicalHistory.objects.filter(
            family_member__user=self.request.user
        )

    def perform_create(self, serializer):
        family_member = serializer.validated_data["family_member"]

        if family_member.user != self.request.user:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied(
                "You can only add medical history for your own family members."
            )

        serializer.save()
class DoctorViewSet(viewsets.ModelViewSet):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Doctor.objects.filter(
            family_member__user=self.request.user
        )

    def perform_create(self, serializer):
        family_member = serializer.validated_data["family_member"]

        if family_member.user != self.request.user:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied(
                "You can only add doctors for your own family members."
            )

        serializer.save()

class MedicalDocumentViewSet(viewsets.ModelViewSet):
    queryset = MedicalDocument.objects.all()
    serializer_class = MedicalDocumentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return MedicalDocument.objects.filter(
            family_member__user=self.request.user
        )

    def perform_create(self, serializer):
        family_member = serializer.validated_data["family_member"]

        if family_member.user != self.request.user:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied(
                "You can only add documents for your own family members."
            )

        serializer.save()

class VitalRecordViewSet(viewsets.ModelViewSet):
    queryset = VitalRecord.objects.all()
    serializer_class = VitalRecordSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return VitalRecord.objects.filter(
            family_member__user=self.request.user
        )

    def perform_create(self, serializer):
        family_member = serializer.validated_data["family_member"]

        if family_member.user != self.request.user:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied(
                "You can only add vital records for your own family members."
            )

        serializer.save()

class MedicalClaimViewSet(viewsets.ModelViewSet):
    serializer_class = MedicalClaimSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return MedicalClaim.objects.filter(
            family_member__user=self.request.user
        )

    def perform_create(self, serializer):
        family_member = serializer.validated_data["family_member"]

        if family_member.user != self.request.user:
            raise PermissionDenied(
                "You can only add claims for your own family members."
            )

        serializer.save()