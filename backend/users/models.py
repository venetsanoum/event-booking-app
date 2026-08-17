from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.

class CustomUser(AbstractUser):
    ROLE_CHOICES = [("ADMIN","Admin"), ("ORGANIZER","Organizer"), ("ATTENDEE","Attendee")]
    APPROVAL_CHOICES =[("PENDING", "pending"), ("REJECTED", "rejected"), ("APPROVED", "approved")]
    phone = models.CharField(max_length=10, blank=True)
    address = models.CharField(max_length=200, blank=True)
    city=models.CharField(max_length=100, blank=True)
    country=models.CharField(max_length=100, blank=True)
    afm=models.CharField(max_length=10, blank=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="ATTENDEE")
    profile_photo = models.ImageField(upload_to="users", blank=True, null=True)
    approval_status = models.CharField(max_length=20, choices=APPROVAL_CHOICES, default="PENDING")
    def __str__(self):
        return self.username