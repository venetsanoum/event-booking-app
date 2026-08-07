from django.core.management.base import BaseCommand
from users.models import CustomUser

class Command(BaseCommand):
    help = "This will create a default admin user"
    def handle(self, *args, **kwargs):
        username = "admin"
        if not CustomUser.objects.filter(username=username).exists():
            CustomUser.objects.create_user(
                username=username,
                email="admin@example.com",
                password="admin@",
                role="ADMIN",
                approval_status="APPROVED"
            )
            self.stdout.write(
                self.style.SUCCESS("Admin user created")
            )
        else:
            self.stdout.write(
                self.style.WARNING("Admin already exists")
            )