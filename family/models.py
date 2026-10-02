from django.db import models
from django.contrib.auth.models import User


class FamilyMember(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="family_members"
    )
    name = models.CharField(max_length=100)
    relation = models.CharField(max_length=50)
    date_of_birth = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=20, blank=True)
    notes = models.TextField(blank=True)

    def __str__(self):
        return f"{self.name} ({self.relation})"



class MedicalHistory(models.Model):
    family_member = models.OneToOneField(
        FamilyMember,
        on_delete=models.CASCADE,
        related_name="medical_history"
    )
    chronic_conditions = models.TextField(blank=True)
    allergies = models.TextField(blank=True)
    past_surgeries = models.TextField(blank=True)
    family_history = models.TextField(blank=True)
    notes = models.TextField(blank=True)

    def __str__(self):
        return f"Medical History - {self.family_member.name}"


class Doctor(models.Model):
    family_member = models.ForeignKey(
        FamilyMember,
        on_delete=models.CASCADE,
        related_name="doctors"
    )
    name = models.CharField(max_length=100)
    specialization = models.CharField(max_length=100, blank=True)
    hospital = models.CharField(max_length=150, blank=True)
    phone = models.CharField(max_length=20, blank=True)
    notes = models.TextField(blank=True)

    def __str__(self):
        return self.name



class MedicalDocument(models.Model):
    DOCUMENT_TYPES = [
        ("prescription", "Prescription"),
        ("lab_report", "Lab Report"),
        ("xray", "X-Ray / Scan"),
        ("other", "Other"),
    ]

    family_member = models.ForeignKey(
        FamilyMember,
        on_delete=models.CASCADE,
        related_name="documents"
    )
    title = models.CharField(max_length=150)
    document_type = models.CharField(
        max_length=20,
        choices=DOCUMENT_TYPES
    )
    file = models.FileField(upload_to="medical_documents/")
    notes = models.TextField(blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


    

class VitalRecord(models.Model):
    family_member = models.ForeignKey(
        FamilyMember,
        on_delete=models.CASCADE,
        related_name="vitals"
    )
    blood_pressure = models.CharField(max_length=20, blank=True)
    blood_sugar = models.DecimalField(
        max_digits=6,
        decimal_places=2,
        null=True,
        blank=True
    )
    pulse_rate = models.PositiveIntegerField(
        null=True,
        blank=True
    )
    spo2 = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True
    )
    weight = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True
    )
    recorded_at = models.DateTimeField(auto_now_add=True)
    notes = models.TextField(blank=True)

    def __str__(self):
        return f"Vitals - {self.family_member.name}"