from django.shortcuts import render
from rest_framework import generics, status, serializers
from .serializers import CreateEventSerializer, TicketTypeSerializer, EventImageSerializer, MyEventsSerializer, SingleEventDetailsSerializer, EditEventSerializer
from .serializers import SearchEventSerializer
from .models import Event
from .filters import EventFilter
from rest_framework.response import Response
from .permissions import isOrganizer,isEventOrganizer
from rest_framework.permissions import IsAuthenticated
from rest_framework import views, filters
from django_filters.rest_framework import DjangoFilterBackend
# Create your views here.
# POST /events
class CreateEventView(generics.CreateAPIView):
    serializer_class=CreateEventSerializer
    permission_classes=[IsAuthenticated,isOrganizer]
    def create(self, request, *args, **kwargs):
        serializer=self.get_serializer(data=request.data) # το view φτιάχνει serializer
        serializer.is_valid(raise_exception=True)
        # δημιουργία του αντικειμένου
        serializer.save(organizer=request.user) # θέλουμε ο συνδεδεμένος χρήστης να μπει στο πεδίο organizer του νέου event
        return Response(
            {
                "message": "First step of event creation is complete"
            },
            status=status.HTTP_201_CREATED 
        )
# POST events/{id}/ticket-type 
class TicketTypeView(generics.CreateAPIView):
    serializer_class=TicketTypeSerializer
    permission_classes=[IsAuthenticated ,isOrganizer, isEventOrganizer]
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
# POST events/{id}/images
class EventImageView(generics.CreateAPIView):
    serializer_class=EventImageSerializer
    permission_classes=[IsAuthenticated, isOrganizer, isEventOrganizer]
    def create(self, request, *args, **kwargs):
        event_id=self.kwargs["pk"]
        event=Event.objects.get(id=event_id)
        serializer=self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(event=event)
        return Response({
            "message": "Image uploaded"
        },
        status=status.HTTP_201_CREATED
        )
# GET events/my-events
class MyEventsView(generics.ListAPIView):
    serializer_class=MyEventsSerializer
    permission_classes=[IsAuthenticated, isOrganizer]
    def get_queryset(self):
        return Event.objects.filter(organizer=self.request.user, status="DRAFT")
    
# GET events/{id}/bookings
class SingleEventDetailsView(generics.RetrieveAPIView):
    serializer_class=SingleEventDetailsSerializer
    permission_classes=[isOrganizer, isEventOrganizer, IsAuthenticated]
    queryset=Event.objects.all()
# PUT/PATCH/DELETE events/{id}/edit
class EditEventView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class=EditEventSerializer
    permission_classes=[IsAuthenticated, isOrganizer, isEventOrganizer]
    queryset = Event.objects.all()
    def perform_destroy(self, instance):
        if instance.status != "DRAFT" and instance.bookings.exists():
            raise serializers.ValidationError("A published event with bookings cannot be deleted")
        instance.delete()
    def perform_update(self, serializer):
        event=self.get_object()
        newstatus=serializer.validated_data.get("status", event.status) # αυτό που επέστρεψε το frontend (το update)
        # αν δεν ηταν published το event και προσπαθήσει να το κανει cancelled αυτό είναι error
        if newstatus == "CANCELLED" and event.status != "PUBLISHED":
            raise serializers.ValidationError("Only published events can be cancelled")
        serializer.save()
# search events page
class SearchEventView(generics.ListAPIView):
    queryset=Event.objects.filter(status="PUBLISHED")
    serializer_class=SearchEventSerializer
    filter_backends=[DjangoFilterBackend]
    filterset_class = EventFilter

