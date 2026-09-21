from django.shortcuts import render
from rest_framework import generics, status, serializers
from .serializers import CreateEventSerializer, TicketTypeSerializer, EventImageSerializer, EditEventSerializer, EventViewSerializer
from .serializers import SearchEventSerializer, CategoryInfoSerializer, EventDetailsSerializer, TicketTypeEditSerializer, TicketTypeInfoSerializer
from .serializers import CreateDraftEventSerializer
from .models import Event, Category, TicketType, EventView
from booking.models import BookingItems
from .filters import EventFilter
from rest_framework.response import Response
from .permissions import isOrganizer,isEventOrganizer, isEventOrganizerTicketEdition, isDraftedEvent
from rest_framework.permissions import IsAuthenticated
from rest_framework import views, filters
from django_filters.rest_framework import DjangoFilterBackend
from messaging.models import Message
import datetime
from users.permissions import IsAppAdmin
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from django.utils import timezone
# Create your views here.
# POST /events
class CreateEventView(generics.CreateAPIView):
    serializer_class=CreateEventSerializer
    permission_classes=[IsAuthenticated,isOrganizer]
    def create(self, request, *args, **kwargs):
        serializer=self.get_serializer(data=request.data) # το view φτιάχνει serializer
        serializer.is_valid(raise_exception=True)
        # δημιουργία του αντικειμένου
        event=serializer.save(organizer=request.user, status="DRAFT") # θέλουμε ο συνδεδεμένος χρήστης να μπει στο πεδίο organizer του νέου event
        return Response(
            {
                "message": "First step of event creation is complete",
                "event_id":event.id,
            },
            status=status.HTTP_201_CREATED 
        )
# POST events/draft-events
class CreateDraftEventView(generics.CreateAPIView):
    serializer_class=CreateDraftEventSerializer
    permission_classes=[IsAuthenticated,isOrganizer]
    def create(self, request, *args, **kwargs):
        serializer=self.get_serializer(data=request.data) # το view φτιάχνει serializer
        serializer.is_valid(raise_exception=True)
        # δημιουργία του αντικειμένου
        event=serializer.save(organizer=request.user, status="DRAFT") # θέλουμε ο συνδεδεμένος χρήστης να μπει στο πεδίο organizer του νέου event
        return Response(
            {
                "message": "Event is saved as draft",
                "event_id":event.id
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
# POST events/{id}/publish
class PublishEventView(generics.CreateAPIView):
    permission_classes=[IsAuthenticated, isEventOrganizer]
    def post(self, request, *args, **kwargs):
        event=get_object_or_404(Event, id=kwargs["pk"])
        if event.status != "DRAFT":
            return Response(
                {"error": "only draft events can be published"},
                status=status.HTTP_400_BAD_REQUEST
            )
        if not event.title:
            raise serializers.ValidationError("Title is required")
        if not event.venue:
            raise serializers.ValidationError("Venue is required")
        if not event.address:
            raise serializers.ValidationError("Address is required")
        if not event.city:
            raise serializers.ValidationError("City is required")
        if not event.country:
            raise serializers.ValidationError("Country is required")
        if not event.description:
            raise serializers.ValidationError("Description is required")
        if event.startDateTime >= event.endDateTime:
            raise serializers.ValidationError("Start DateTime must be before end DateTime")
        if(event.capacity <= 0):
            raise serializers.ValidationError("Capacity must be a positive integer")
        if(event.startDateTime < timezone.now()): # !!
            raise serializers.ValidationError("Start date cannot be in the past")
        if not event.ticket_types.exists():
            return Response(
                {"error":"There has to be at least one ticket type"},
                status=status.HTTP_400_BAD_REQUEST
            )
        event.status="PUBLISHED"
        event.save()
        return Response(
            {"message":"Event published succesfully"},
            status=status.HTTP_200_OK
        )

# GET events/my-events
class MyEventsView(generics.ListAPIView):
    serializer_class=EventDetailsSerializer
    permission_classes=[IsAuthenticated, isOrganizer]
    def get_queryset(self):
        return Event.objects.filter(organizer=self.request.user, status="PUBLISHED")
# GET events/my-cancelled-events
class MyCancelledEventsView(generics.ListAPIView):
    serializer_class=EventDetailsSerializer
    permission_classes=[IsAuthenticated, isOrganizer]
    def get_queryset(self):
        return Event.objects.filter(organizer=self.request.user, status="CANCELLED")
# GET events/my-completed-events
class MyCompletedEventsView(generics.ListAPIView):
    serializer_class=EventDetailsSerializer
    permission_classes=[IsAuthenticated, isOrganizer]
    def get_queryset(self):
        return Event.objects.filter(organizer=self.request.user, status="COMPLETED")
# GET events/my-drafted-events
class MyDraftEventsView(generics.ListAPIView):
    serializer_class=EventDetailsSerializer
    permission_classes=[IsAuthenticated, isOrganizer]
    def get_queryset(self):
        return Event.objects.filter(organizer=self.request.user, status="DRAFT")
# PUT/PATCH/DELETE events/{id}/edit
class EditEventView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class=EditEventSerializer
    permission_classes=[IsAuthenticated, isOrganizer, isEventOrganizer, isDraftedEvent]
    queryset = Event.objects.all()        
    def perform_destroy(self, instance):
        # μόνο draft εκδηλώσεις μπορούν να διαγραφούν
        if instance.status != "DRAFT" and instance.bookings.exists():
            raise serializers.ValidationError("A published event with bookings cannot be deleted")
        instance.delete() 
# POST events/{id}/cancel/
class CancelEventView(generics.UpdateAPIView):
    permission_classes=[IsAuthenticated, isEventOrganizer]
    def post(self, request, *args, **kwargs):
        event=get_object_or_404(Event, id=kwargs["pk"])
        if event.status != "PUBLISHED":
            return Response(
                {"message":"Only published events can be cancelled"},
                status=status.HTTP_400_BAD_REQUEST
            )
        event.status="CANCELLED"
        event.save()
        all_bookings = event.bookings.all()
        for booking in all_bookings:
            user=booking.attendee
            booking.status="CANCELLED"
            booking.save()
            cancellation_message=Message(
                subject="Event Cancellation",
                content="lalalal....",
                sender=event.organizer,
                receiver=user,
                event=event,
                sendDateTime=datetime.datetime.now()
            )
            cancellation_message.save()
        return Response({
            "message":"Event cancelled succesfully"
        },
        status=status.HTTP_200_OK)
# search events page
class SearchEventView(generics.ListAPIView):
    queryset=Event.objects.filter(status="PUBLISHED").order_by("startDateTime")
    serializer_class=SearchEventSerializer
    filter_backends=[DjangoFilterBackend]
    filterset_class = EventFilter
# GET events/cities
class CitiesView(APIView):
    def get(self, request):
        cities=(
            Event.objects.filter(status="PUBLISHED").values_list("city", flat=True).distinct().order_by("city")
        )
        return Response(cities)
# POST events/category
class AddCategoryView(generics.CreateAPIView):
    serializer_class=CategoryInfoSerializer
    permission_classes=[IsAuthenticated, IsAppAdmin]
# GET events/category-list
class AllCategoriesView(generics.ListAPIView):
    serializer_class=CategoryInfoSerializer
    queryset=Category.objects.all()
# GET events/active
class AllActiveEventsView(generics.ListAPIView):
    serializer_class=EventDetailsSerializer
    def get_queryset(self):
        return Event.objects.filter(status="PUBLISHED")
# GET events/all
class AllEventsView(generics.ListAPIView):
    serializer_class=EventDetailsSerializer
    permission_classes=[IsAppAdmin]
    queryset=Event.objects.all()
# GET events/details/{id}
class EventDetailsView(generics.RetrieveAPIView):
    serializer_class=EventDetailsSerializer
    queryset=Event.objects.all()
    def get_queryset(self):
        return Event.objects.filter(status="PUBLISHED")
    def retrieve(self, request, *args, **kwargs):
        event=self.get_object()
        if request.user.is_authenticated:
            EventView.objects.get_or_create(
                user=request.user,
                event=event
            )
        serializer=self.get_serializer(event)
        return Response(serializer.data)
# GET events/preview/{id}
class EventPreviewView(generics.RetrieveAPIView):
    serializer_class=EventDetailsSerializer
    permission_classes=[IsAuthenticated, isEventOrganizer]
    queryset=Event.objects.all()
    def get_queryset(self):
        return Event.objects.filter(id=self.kwargs["pk"], status__in=["CANCELLED", "PUBLISHED", "COMPLETED"])
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
    queryset=TicketType.objects.all()

# PATCH events/{event_id}/ticket-types/{ticket_id:pk}
class EditTicketTypesView(generics.UpdateAPIView):
    serializer_class=TicketTypeEditSerializer
    permission_classes=[IsAuthenticated, isEventOrganizerTicketEdition, isDraftedEvent]
    def get_queryset(self):
        return TicketType.objects.filter(event_id=self.kwargs["event_id"])
# GET events/{id}/event-ticket-types
class EventTicketTypesView(generics.ListAPIView):
    serializer_class=TicketTypeInfoSerializer
    def get_queryset(self):
        event_id=self.kwargs["pk"]
        return TicketType.objects.filter(event_id=event_id)

# DELETE events/{event_id}/ticket-types/{ticket_id:pk}
class DeleteTicketTypeView(generics.DestroyAPIView):
    permission_classes=[IsAuthenticated, isEventOrganizerTicketEdition, isDraftedEvent]
    def perform_destroy(self, instance):
        if BookingItems.objects.filter(ticket_type=instance).exists():
            raise serializers.ValidationError("Cannot delete ticket type that has bookings")
        return super().perform_destroy(instance)
    def get_queryset(self):
        event_id=self.kwargs["event_id"]
        return TicketType.objects.filter(event_id=event_id)

class EventViewView(generics.ListAPIView):
    permission_classes=[IsAppAdmin]
    serializer_class=EventViewSerializer
    queryset=EventView.objects.all()