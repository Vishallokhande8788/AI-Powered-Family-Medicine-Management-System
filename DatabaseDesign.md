Django User
     │
     │ 1 → Many
     ↓
FamilyMember
     │
     │ 1 → Many
     ↓
Medicine
     │
     │ 1 → Many
     ↓
MedicineSchedule
     │
     │ 1 → Many
     ↓
MedicineLog




<!-- data base structure after patient medical history traccking  -->

                     User
                       │
                       ↓
                 FamilyMember
                       │
        ┌──────────────┼──────────────┐
        ↓              ↓              ↓
 MedicalHistory     Doctor       MedicalDocument
                       │
                       │
                       └──────────────┐
                                      ↓
                                   Medicines
                                      ↓
                              MedicineSchedule
                                      ↓
                                 MedicineLog

                 FamilyMember
                       ↓
                  VitalRecord 