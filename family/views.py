from django.shortcuts import render

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
    queryset = FamilyMember.objects.all()
    serializer_class = FamilyMemberSerializer


class MedicalHistoryViewSet(viewsets.ModelViewSet):
    queryset = MedicalHistory.objects.all()
    serializer_class = MedicalHistorySerializer


class DoctorViewSet(viewsets.ModelViewSet):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer


class MedicalDocumentViewSet(viewsets.ModelViewSet):
    queryset = MedicalDocument.objects.all()
    serializer_class = MedicalDocumentSerializer


class VitalRecordViewSet(viewsets.ModelViewSet):
    queryset = VitalRecord.objects.all()
    serializer_class = VitalRecordSerializer