from rest_framework.permissions import BasePermission
from events.models import Event

class IsEventOrganizer(BasePermission):
    def has_permission(self, request, view):
        event_id=view.kwargs["event_id"]
        event=Event.objects.get(id=event_id)
        return event.organizer==request.user