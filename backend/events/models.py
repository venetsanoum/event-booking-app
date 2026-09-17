from django.db import models
from users.models import CustomUser
# Create your models here.

class Category(models.Model):
    name=models.CharField(max_length=100)

class Event(models.Model):
    EVENT_STATUS=[("DRAFT", "draft"), ("PUBLISHED", "published"), ("CANCELLED", "cancelled"), ("COMPLETED", "completed")]
    title = models.CharField(max_length=100, blank=True)
    organizer = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    # Event - Category N->M σχέση
    category=models.ManyToManyField(Category, blank=True)
    eventType=models.TextField()
    venue=models.CharField(max_length=100, blank=True)
    address=models.CharField(max_length=200, blank=True)
    city=models.CharField(max_length=100, blank=True)
    country=models.CharField(max_length=100, blank=True)
    latitude=models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude=models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    startDateTime=models.DateTimeField()
    endDateTime=models.DateTimeField()
    capacity=models.IntegerField(default=0)
    description=models.TextField()
    status=models.CharField(max_length=20, choices=EVENT_STATUS)
# ένα event έχει πολλές εικόνες
class EventImage(models.Model):
    event=models.ForeignKey(Event, on_delete=models.CASCADE, related_name="images")
    photo=models.ImageField(upload_to="events")
class TicketType(models.Model):
    name=models.CharField(max_length=100, blank=True)
    price=models.DecimalField(max_digits=10, decimal_places=2)
    quantity=models.IntegerField(default=0)
    available=models.IntegerField(default=0)
    # Event - TicketType 1->N σχέση
    event=models.ForeignKey(Event, on_delete=models.CASCADE, related_name="ticket_types")
# ιστορικό προβολών εκδηλώσεων
class EventView(models.Model):
    user=models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    event=models.ForeignKey(Event, on_delete=models.CASCADE, related_name="views")
    viewed_at=models.DateTimeField(auto_now_add=True)
    class Meta:
        constraints=[models.UniqueConstraint(fields=["user", "event"], name="unique-views")]