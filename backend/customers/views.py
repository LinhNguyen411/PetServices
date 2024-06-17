from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action

from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.pagination import PageNumberPagination

from accounts.models import UserAccount
from accounts.serializers import AccountSerializer

from .models import Customer
from .serializers import CustomerSerializer
from pets.models import Pet
from pets.serializers import PetSerializer

class CustomerViewSet(ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    filter_backends = [SearchFilter,OrderingFilter,DjangoFilterBackend]
    filterset_fields = ['account']
    search_fields = ['id','name', 'phone_number']
    pagination_class = PageNumberPagination
    ordering_fields = ['name', 'address']

    @action(detail=True, methods=['GET', 'POST'])
    def pets(self, request, pk=None):
        if request.method == 'GET':
            pets = Pet.objects.filter(owner = pk)
            serializers = PetSerializer(pets, many = True)
            return Response(serializers.data)
        if request.method == 'POST':
            try:
                data = request.data
                data['owner'] = pk
                serializer = PetSerializer(data=data)
                if serializer.is_valid():
                    serializer.save()
                    return Response(serializer.data)
                
            except:
                return Response("Missing data!", status=status.HTTP_400_BAD_REQUEST, safe=False)
            
    @action(detail=True, methods=['POST'])
    def account(self, request, pk = None):
        try:
            customer = self.get_object()
        except Customer.DoesNotExist:
            return Response({"error": "Customer not found!"}, status = 404)
        if request.method == 'POST':
            account = UserAccount.objects.get(id = customer.account.id)
            if request.FILES:
                account.photo = request.FILES['photo']
            account.name = request.POST['name']
            account.save()
            return Response({"message": "Update Success"}, status=200)


