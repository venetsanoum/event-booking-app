from django.shortcuts import render
from rest_framework import generics, status, serializers
from .serializers import CreateEventSerializer, TicketTypeSerializer, EventImageSerializer, MyEventsSerializer, EditEventSerializer
from .serializers import SearchEventSerializer, CategoryInfoSerializer, EventDetailsSerializer
from .models import Event, Category, TicketType
from .filters import EventFilter
from rest_framework.response import Response
from .permissions import isOrganizer,isEventOrganizer
from rest_framework.permissions import IsAuthenticated
from rest_framework import views, filters
from django_filters.rest_framework import DjangoFilterBackend
from messaging.models import Message
import datetime
from users.permissions import IsAppAdmin
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
        return Event.objects.filter(organizer=self.request.user, status="PUBLISHED")
# GET events/my-drafted-events
class MyDraftEventsView(generics.ListAPIView):
    serializer_class=MyEventsSerializer
    permission_classes=[IsAuthenticated, isOrganizer]
    def get_queryset(self):
        return Event.objects.filter(organizer=self.request.user, status="DRAFT")
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
        oldstatus=event.status
        newstatus=serializer.validated_data.get("status", oldstatus) # αυτό που επέστρεψε το frontend (το update)
        newcapacity=serializer.validated_data.get("capacity", event.capacity)
        total_quant = sum(tick.quantity for tick in event.ticket_types.all())
        if newcapacity < total_quant:
            raise serializers.ValidationError("New capacity is lower than current tickets quantity")
        # αν δεν ηταν published το event και προσπαθήσει να το κανει cancelled αυτό είναι error
        if newstatus == "CANCELLED" and oldstatus != "PUBLISHED":
            raise serializers.ValidationError("Only published events can be cancelled")
        serializer.save()
        # στελνεται μηνυμα σε ολους οσους εχουν κανει κρατηση σε καποιο event το οποιο ακυρωθηκε
        if newstatus == "CANCELLED" and oldstatus != "CANCELLED":
            all_bookings = event.bookings.all()
            for booking in all_bookings:
                user=booking.attendee
                cancellation_message=Message(
                    subject="Event Cancellation",
                    content="lalalal....",
                    sender=event.organizer,
                    receiver=user,
                    event=event,
                    sendDateTime=datetime.datetime.now()

                )
                cancellation_message.save()
# search events page
class SearchEventView(generics.ListAPIView):
    queryset=Event.objects.filter(status="PUBLISHED")
    serializer_class=SearchEventSerializer
    filter_backends=[DjangoFilterBackend]
    filterset_class = EventFilter
# POST events/category
class AddCategoryView(generics.CreateAPIView):
    serializer_class=CategoryInfoSerializer
    permission_classes=[IsAuthenticated, IsAppAdmin]
# GET events/category-list
class AllCategoriesView(generics.ListAPIView):
    serializer_class=CategoryInfoSerializer
    permission_classes=[IsAuthenticated]
    queryset=Category.objects.all()
# GET events/all
class AllEventsView(generics.ListAPIView):
    serializer_class=MyEventsSerializer
    #permission_classes=[IsAuthenticated]
    queryset=Event.objects.all()
# GET events/details/{id}
class EventDetailsView(generics.RetrieveAPIView):
    serializer_class=EventDetailsSerializer
    #permission_classes=[IsAuthenticated]
    queryset=Event.objects.all()

# --------------------------Ticket Types Endpoints -------------------------- #
# POST events/{id}/ticket-type 
class TicketTypeView(generics.CreateAPIView):
    serializer_class=TicketTypeSerializer
    permission_classes=[IsAuthenticated ,isOrganizer, isEventOrganizer]
    def create(self, request, *args, **kwargs):
        event_id=self.kwargs["pk"]
        event = Event.objects.get(id=event_id)
        # περνάμε σαν context το event στο serializer ώστε
        # να χρησιμοποιηθεί στο validation
        print(self.get_serializer_class())
        serializer=self.get_serializer(data=request.data, context={"event":event}) 
        serializer.is_valid(raise_exception=True)
        serializer.save(event=event, available=serializer.validated_data["quantity"]) # περνάμε και το event ωστε να αποθηκευτει
        return Response({
            "message": "Ticket Type created"
        },
        status=status.HTTP_201_CREATED
        )
# GET events/ticket-types
class AllTicketTypesView(generics.ListAPIView):
    serializer_class=TicketTypeSerializer
    #permission_classes=[IsAuthenticated]
    queryset=TicketType.objects.all()