#!/bin/bash
set -e

echo "Skipping migrations (using pre-loaded SQL database)..."

echo "Ensuring admin accounts have correct passwords..."
python manage.py shell << EOF
from django.contrib.auth import get_user_model
User = get_user_model()

# Update admin@admin.com
try:
    user = User.objects.get(email="admin@admin.com")
    user.set_password("password")
    user.is_superuser = True
    user.is_staff = True
    user.save()
    print("Updated admin@admin.com with new password and superuser rights.")
except User.DoesNotExist:
    print("admin@admin.com does not exist. No changes made.")

# Update quanly4759@petcares.com
try:
    user = User.objects.get(email="quanly4759@petcares.com")
    user.set_password("password")
    user.save()
    print("Updated quanly4759@petcares.com with new password.")
except User.DoesNotExist:
    print("quanly4759@petcares.com does not exist. No changes made.")
EOF

echo "Starting Django server..."
exec "$@"
