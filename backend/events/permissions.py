from rest_framework.permissions import BasePermission
from .models import Event
class isOrganizer(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == "ORGANIZER"
# Για το tickettype creation ελεγχω αν οντως ο organizer είναι organizer του συγκεκριμένου event με id που ηρθε απο το url
class isEventOrganizer(BasePermission):
    def has_permission(self, request, view):
        event_id=view.kwargs["pk"]
        event=Event.objects.get(id=event_id)
        return event.organizer==request.user