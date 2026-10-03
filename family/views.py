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
)

from .serializers import (
    FamilyMemberSerializer,
    MedicalHistorySerializer,
    DoctorSerializer,
    MedicalDocumentSerializer,
    VitalRecordSerializer,
)


class FamilyMemberViewSet(viewsets.ModelViewSet):
    serializer_class = FamilyMemberSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return FamilyMember.objects.filter(user=self.request.user)


class MedicalHistoryViewSet(viewsets.ModelViewSet):
    queryset = MedicalHistory.objects.all()
    serializer_class = MedicalHistorySerializer
    permission_classes = [IsAuthenticated]


class DoctorViewSet(viewsets.ModelViewSet):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer
    permission_classes = [IsAuthenticated]


class MedicalDocumentViewSet(viewsets.ModelViewSet):
    queryset = MedicalDocument.objects.all()
    serializer_class = MedicalDocumentSerializer
    permission_classes = [IsAuthenticated]


class VitalRecordViewSet(viewsets.ModelViewSet):
    queryset = VitalRecord.objects.all()
    serializer_class = VitalRecordSerializer
    permission_classes = [IsAuthenticated]