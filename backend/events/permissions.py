from rest_framework.permissions import BasePermission
from .models import Event, TicketType
from django.shortcuts import get_object_or_404
class isOrganizer(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == "ORGANIZER"
# Για το tickettype creation ελεγχω αν οντως ο organizer είναι organizer του συγκεκριμένου event με id που ηρθε απο το url
class isEventOrganizer(BasePermission):
    def has_permission(self, request, view):
        event_id=view.kwargs["pk"]
        event= get_object_or_404(Event, id=event_id)
        return event.organizer==request.user
class isEventOrganizerTicketEdition(BasePermission):
    def has_permission(self, request, view):
        ticket_id=view.kwargs["pk"]
        ticket=get_object_or_404(TicketType, id=ticket_id)
        event=ticket.event
        return event.organizer==request.user
class isDraftedEvent(BasePermission):
    def has_permission(self, request, view):
        ticket_id=view.kwargs["pk"]
        ticket=get_object_or_404(TicketType, id=ticket_id)
        event=ticket.event
        return event.status == "DRAFT"