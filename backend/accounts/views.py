from rest_framework.viewsets import ModelViewSet
from .models import UserAccount
from .serializers import AccountSerializer
# Create your views here.
class UserAccountViewSet(ModelViewSet):
    queryset = UserAccount.objects.exclude(account_type="a")
    serializer_class = AccountSerializer