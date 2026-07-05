from django.db import models
from users.models import CustomUser
# Create your models here.

class Category(models.Model):
    name=models.CharField(max_length=100)

class Event(models.Model):
    EVENT_STATUS=[("DRAFT", "draft"), ("PUBLISHED", "published"), ("CANCELLED", "cancelled")]
    title = models.CharField(max_length=100, blank=True)
    # Event - Category N->M σχέση
    category=models.ManyToManyField(Category)
    eventType=models.TextField()
    venue=models.CharField(max_length=100, blank=True)
    address=models.CharField(max_length=200, blank=True)
    city=models.CharField(max_length=100, blank=True)
    country=models.CharField(max_length=100, blank=True)
    latitude=models.DecimalField(max_digits=9, decimal_places=6)
    longtitude=models.DecimalField(max_digits=9, decimal_places=6)
    startDateTime=models.DateTimeField()
    endDateTime=models.DateTimeField()
    capacity=models.IntegerField(default=0)
    description=models.TextField()
    status=models.CharField(max_length=20, choices=EVENT_STATUS)

class TicketType(models.Model):
    name=models.CharField(max_length=100, blank=True)
    price=models.DecimalField(max_digits=10, decimal_places=2)
    quantity=models.IntegerField(default=0)
    available=models.IntegerField(default=0)
    # Event - TicketType 1->N σχέση
    event=models.ForeignKey(Event, on_delete=models.CASCADE, related_name="ticket_types")

class Booking(models.Model):
    BOOKING_STATUS=[("CONFIRMED", "confirmed"), ("PENDING", "pending"), ("REJECTED", "rejected")]
    # Attendee - Booking 1->N σχέση
    attendee=models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    time=models.DateTimeField()
    number=models.IntegerField(default=0)
    cost=models.DecimalField(max_digits=10, decimal_places=2)
    status=models.CharField(max_length=20, choices=BOOKING_STATUS)
    # Event - Booking 1->N σχέση
    event=models.ForeignKey(Event, on_delete=models.CASCADE)
    # TicketType - Booking 1->N σχέση
    ticket_type = models.ForeignKey(TicketType, on_delete=models.CASCADE)
