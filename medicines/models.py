from django.db import models


class Medicine(models.Model):
    family_member = models.ForeignKey(
        "family.FamilyMember",
        on_delete=models.CASCADE,
        related_name="medicines"
    )
    name = models.CharField(max_length=100)
    dosage = models.CharField(max_length=100)
    quantity = models.PositiveIntegerField(default=0)
    instructions = models.TextField(blank=True)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return self.name






class MedicineSchedule(models.Model):
    medicine = models.ForeignKey(
        Medicine,
        on_delete=models.CASCADE,
        related_name="schedules"
    )
    time = models.TimeField()
    dosage = models.CharField(max_length=100)
    meal_relation = models.CharField(
        max_length=20,
        choices=[
            ("before_food", "Before Food"),
            ("after_food", "After Food"),
            ("with_food", "With Food"),
            ("anytime", "Anytime"),
        ],
        default="anytime"
    )
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"{self.medicine.name} - {self.time}"





class MedicineLog(models.Model):
    schedule = models.ForeignKey(
        MedicineSchedule,
        on_delete=models.CASCADE,
        related_name="logs"
    )
    date = models.DateField()
    status = models.CharField(
        max_length=20,
        choices=[
            ("pending", "Pending"),
            ("taken", "Taken"),
            ("missed", "Missed"),
        ],
        default="pending"
    )
    taken_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.schedule.medicine.name} - {self.date} - {self.status}"