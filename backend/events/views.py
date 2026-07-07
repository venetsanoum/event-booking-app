from django.shortcuts import render
from rest_framework import generics, status
from .serializers import CreateEventSerializer, TicketTypeSerializer
from .models import Event
from rest_framework.response import Response
from .permissions import isOrganizer,isEventOrganizer
# Create your views here.
# POST /events
class CreateEventView(generics.CreateAPIView):
    serializer_class=CreateEventSerializer
    permission_classes=[isOrganizer]
    def create(self, request, *args, **kwargs):
        serializer=self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(organizer=request.user)
        return Response(
            {
                "message": "First step of event creation is complete"
            },
            status=status.HTTP_201_CREATED 
        )
# POST events/{id}/ticket-type 
class TicketTypeView(generics.CreateAPIView):
    serializer_class=TicketTypeSerializer
    permission_classes=[isOrganizer, isEventOrganizer]
    def create(self, request, *args, **kwargs):
        event_id=self.kwargs["pk"]
        event = Event.objects.get(id=event_id)
        serializer=self.get_serializer(data=request.data, context={"event":event})
        serializer.is_valid(raise_exception=True)
        serializer.save(event=event)
        return Response({
            "message": "Ticket Type created"
        },
        status=status.HTTP_201_CREATED
        )

