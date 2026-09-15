from django.db import models

# Create your models here.
from django.db import models
from family.models import FamilyMember

class Medicine(models.Model):
    FOOD_CHOICES = [('before', 'Before Food'), ('after', 'After Food')]

    family_member = models.ForeignKey(FamilyMember, on_delete=models.CASCADE, related_name='medicines')
    name = models.CharField(max_length=100)
    dosage = models.CharField(max_length=50)          # e.g. "1 tablet", "5ml"
    morning = models.BooleanField(default=False)
    afternoon = models.BooleanField(default=False)
    night = models.BooleanField(default=False)
    food_timing = models.CharField(max_length=10, choices=FOOD_CHOICES)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    stock = models.IntegerField(default=0)

    def __str__(self):
        return self.name


class DoseLog(models.Model):
    STATUS_CHOICES = [('taken', 'Taken'), ('pending', 'Pending'), ('missed', 'Missed')]
    TIME_SLOTS = [('morning', 'Morning'), ('afternoon', 'Afternoon'), ('night', 'Night')]

    medicine = models.ForeignKey(Medicine, on_delete=models.CASCADE, related_name='logs')
    date = models.DateField()
    time_slot = models.CharField(max_length=10, choices=TIME_SLOTS)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')