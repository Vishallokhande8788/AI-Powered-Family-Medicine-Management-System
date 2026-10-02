from rest_framework.routers import DefaultRouter

from .views import (
    MedicineViewSet,
    MedicineScheduleViewSet,
    MedicineLogViewSet,
)

router = DefaultRouter()

router.register("medicines", MedicineViewSet)
router.register("schedules", MedicineScheduleViewSet)
router.register("logs", MedicineLogViewSet)

urlpatterns = router.urls