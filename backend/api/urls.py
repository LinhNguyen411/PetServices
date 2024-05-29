from django.urls import path,include
from rest_framework.routers import DefaultRouter

from customers.views import CustomerViewSet
from employees.views import EmployeeViewSet, WorkScheduleViewSet
from pets.views import WeightViewSet, SpeciesViewSet, PetViewSet
from products.views import ProductViewSet, CategoryViewSet, SupplierViewSet
from services.views import ServiceViewSet, ServiceSurchangesViewSet
from booking.views import RoomViewSet, ServiceBookingViewSet, SubServiceViewSet, DiaryViewSet, PetCheckInOutViewSet
from bill.views import ServiceBillViewSet, ProductBillViewSet, ProductBillItemViewSet
from accounts.views import UserAccountViewSet

router = DefaultRouter()
router.register('customers', CustomerViewSet)

router.register('employees', EmployeeViewSet)
router.register('work_schedules', WorkScheduleViewSet)

router.register('weights', WeightViewSet)
router.register('species', SpeciesViewSet)
router.register('pets', PetViewSet)

router.register('products', ProductViewSet)
router.register('categories', CategoryViewSet)
router.register('suppliers', SupplierViewSet)

router.register('services', ServiceViewSet)
router.register('service_surchanges', ServiceSurchangesViewSet)

router.register('rooms', RoomViewSet)
router.register('service_bookings', ServiceBookingViewSet)
router.register('sub_service', SubServiceViewSet)
router.register('diaries', DiaryViewSet)
router.register('pet_check_in_out', PetCheckInOutViewSet)

router.register('service_bills', ServiceBillViewSet)
router.register('product_bills', ProductBillViewSet)
router.register('product_bill_items', ProductBillItemViewSet)

router.register('accounts', UserAccountViewSet)





urlpatterns = [
  path('', include(router.urls))
]