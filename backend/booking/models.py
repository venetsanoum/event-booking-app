from django.db import models
from events.models import Event, TicketType
from users.models import CustomUser

# Create your models here.
class Booking(models.Model):
    BOOKING_STATUS=[("CONFIRMED", "confirmed"), ("PENDING", "pending"), ("REJECTED", "rejected")]
    # Attendee - Booking 1->N σχέση
    attendee=models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    time=models.DateTimeField()
    number=models.IntegerField(default=0)
    cost=models.DecimalField(max_digits=10, decimal_places=2)
    status=models.CharField(max_length=20, choices=BOOKING_STATUS)
    # Event - Booking 1->N σχέση
    event=models.ForeignKey(Event, on_delete=models.CASCADE, related_name="bookings")
    # TicketType - Booking 1->N σχέση
    ticket_type = models.ForeignKey(TicketType, on_delete=models.CASCADE)
