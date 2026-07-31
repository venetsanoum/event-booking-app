from rest_framework.permissions import BasePermission
from events.models import Event
from booking.models import Booking

# ενας χρηστης μπορει να στειλει μηνυμα αν ειναι διοργανωτης του event ή αν έχει κράτηση στο event
class canSendMessage(BasePermission):
    def has_permission(self, request, view):
        event_id=view.kwargs["pk"]
        event=Event.objects.get(id=event_id)
        return (event.organizer==request.user or 
            Booking.objects.filter(
                event=event,
                attendee=request.user
            ).exists())