from django.db import models
from events.models import Event, TicketType
from users.models import CustomUser

# Create your models here.
class Booking(models.Model):
    # Attendee - Booking 1->N σχέση
    attendee=models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    time=models.DateTimeField()
    cost=models.DecimalField(max_digits=10, decimal_places=2)
    # Event - Booking 1->N σχέση
    event=models.ForeignKey(Event, on_delete=models.CASCADE, related_name="bookings")

class BookingItems(models.Model):
    booking=models.ForeignKey(Booking, on_delete=models.CASCADE, related_name="items")
    ticket_type=models.ForeignKey(TicketType, on_delete=models.CASCADE)
    number=models.IntegerField(default=0)