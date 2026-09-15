from django.db import models
from django.contrib.auth.models import User


class FamilyMember(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='family_members')
    name = models.CharField(max_length=100)
    relation = models.CharField(max_length=50)  # e.g. Father, Mother, Self
    date_of_birth = models.DateField(null=True, blank=True)

    def __str__(self):
        return self.name


class Doctor(models.Model):
    family_member = models.ForeignKey(FamilyMember, on_delete=models.CASCADE, related_name='doctors')
    name = models.CharField(max_length=100)
    specialty = models.CharField(max_length=100, blank=True)
    next_appointment = models.DateField(null=True, blank=True)
    notes = models.TextField(blank=True)
    diet_instructions = models.TextField(blank=True)

    def __str__(self):
        return self.name