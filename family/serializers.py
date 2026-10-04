from rest_framework import serializers
from .models import (
    FamilyMember,
    MedicalHistory,
    Doctor,
    MedicalDocument,
    VitalRecord,
    MedicalClaim,

)


class FamilyMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = FamilyMember
        fields = "__all__"
        read_only_fields = ["user"]


class MedicalHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = MedicalHistory
        fields = "__all__"


class DoctorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Doctor
        fields = "__all__"


class MedicalDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = MedicalDocument
        fields = "__all__"


class VitalRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = VitalRecord
        fields = "__all__"

class MedicalClaimSerializer(serializers.ModelSerializer):
    class Meta:
        model = MedicalClaim
        fields = "__all__"