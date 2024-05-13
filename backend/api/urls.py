from django.urls import path,include
from rest_framework.routers import DefaultRouter

from customers.views import CustomerViewSet
from employees.views import EmployeeViewSet, WorkScheduleViewSet
from pets.views import WeightViewSet, SpeciesViewSet, PetViewSet
from products.views import ProductViewSet, CategoryViewSet, SupplierViewSet
from services.views import ServiceViewSet, ServicePriceViewSet
from bills.views import BillViewSet, BillProductItemViewSet, BillServiceItemViewSet

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
router.register('service_prices', ServicePriceViewSet)

router.register('bills', BillViewSet)
router.register('bill_products', BillProductItemViewSet)
router.register('bill_services', BillServiceItemViewSet)

urlpatterns = [
  path('', include(router.urls))
]