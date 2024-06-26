from django.urls import path,include
from rest_framework.routers import DefaultRouter

from customers.views import CustomerViewSet
from employees.views import EmployeeViewSet, WorkScheduleViewSet
from pets.views import SpeciesViewSet, PetViewSet
from products.views import ProductViewSet, CategoryViewSet, SupplierViewSet
from services.views import ServiceViewSet
from booking.views import RoomViewSet, ServiceBookingViewSet, DiaryViewSet, SubServiceBookingViewSet
from bill.views import ServiceBillViewSet, ProductBillViewSet, ProductBillItemViewSet,SurchargeViewSet
from accounts.views import UserAccountViewSet
from consignment.views import ProvideGoodsViewSet, ServicePackageViewSet, ServicePackageDetailViewSet, ConsignmentViewSet, ConsignmentDetailViewSet, ConsignmentDiaryViewSet, CareDetailViewSet, ConsignmentInvoiceViewSet

router = DefaultRouter()
router.register('customers', CustomerViewSet)

router.register('employees', EmployeeViewSet)
router.register('work_schedules', WorkScheduleViewSet)

router.register('species', SpeciesViewSet)
router.register('pets', PetViewSet)

router.register('products', ProductViewSet)
router.register('categories', CategoryViewSet)
router.register('suppliers', SupplierViewSet)

router.register('services', ServiceViewSet)

router.register('rooms', RoomViewSet)
router.register('service_bookings', ServiceBookingViewSet)
router.register('diaries', DiaryViewSet)
router.register('sub_service_bookings', SubServiceBookingViewSet)

router.register('service_bills', ServiceBillViewSet)
router.register('surcharges', SurchargeViewSet)
router.register('product_bills', ProductBillViewSet)
router.register('product_bill_items', ProductBillItemViewSet)

router.register('provide_goods', ProvideGoodsViewSet)
router.register('service_packages', ServicePackageViewSet)
router.register('service_package_details', ServicePackageDetailViewSet)
router.register('consignments', ConsignmentViewSet)
router.register('consignment_details', ConsignmentDetailViewSet)
router.register('consignment_diaries', ConsignmentDiaryViewSet)
router.register('care_details', CareDetailViewSet)
router.register('consignment_invoices', ConsignmentInvoiceViewSet)




router.register('accounts', UserAccountViewSet)





urlpatterns = [
  path('', include(router.urls))
]