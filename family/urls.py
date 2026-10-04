from rest_framework.routers import DefaultRouter
from .views import (
    FamilyMemberViewSet,
    MedicalHistoryViewSet,
    DoctorViewSet,
    MedicalDocumentViewSet,
    VitalRecordViewSet,
    MedicalClaimViewSet,

)

router = DefaultRouter()

router.register("family-members", FamilyMemberViewSet)
router.register("medical-history", MedicalHistoryViewSet)
router.register("doctors", DoctorViewSet)
router.register("documents", MedicalDocumentViewSet)
router.register("vitals", VitalRecordViewSet)
router.register(
    "medical-claims",
    MedicalClaimViewSet,
    basename="medical-claim"
)

urlpatterns = router.urls