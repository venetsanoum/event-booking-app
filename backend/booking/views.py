from django.shortcuts import render
from rest_framework import generics, status
from .serializers import CreateBookingSerializer, BookingSerializer
from rest_framework.response import Response
from events.models import Event
from django.utils import timezone
from .models import Booking, BookingItems
from rest_framework.permissions import IsAuthenticated
from .permissions import IsEventOrganizer
from messaging.models import Message
from django.shortcuts import get_object_or_404
# Create your views here.

class CreateBookingView(generics.CreateAPIView):
    serializer_class=CreateBookingSerializer
    def create(self, request, *args, **kwargs):
        event_id=self.kwargs["event_id"]
        event=get_object_or_404(Event, id=event_id, status="PUBLISHED")
        serializer=self.get_serializer(data=request.data, context={"event":event}) # το view φτιάχνει serializer
        serializer.is_valid(raise_exception=True)
        items=serializer.validated_data.pop("items")
        total_cost=0
        for item in items:
            total_cost += item["number"] * item["ticket_type"].price
            item["ticket_type"].available -= item["number"]
            item["ticket_type"].save()
        # δημιουργία του αντικειμένου
        booking = serializer.save(attendee=request.user,
                        event=event,
                        cost=total_cost,
                        time=timezone.now()
                        ) 
        for item in items:
            BookingItems.objects.create(booking=booking, ticket_type=item["ticket_type"], number=item["number"])
        confirmation_message=Message(
            subject="Confirmation Message",
            content="lalalal",
            sender=event.organizer,
            receiver=self.request.user,
            event=event,
            sendDateTime=timezone.now()
        )
        confirmation_message.save()
        return Response(
            {
                "message": "First step of booking creation is complete"
            },
            status=status.HTTP_201_CREATED 
        )

class MyBookingsView(generics.ListAPIView):
    serializer_class=BookingSerializer
    permission_classes=[IsAuthenticated]
    def get_queryset(self):
        return Booking.objects.filter(attendee=self.request.user)
class MyCompletedBookingsView(generics.ListAPIView):
    serializer_class=BookingSerializer
    permission_classes=[IsAuthenticated]
    def get_queryset(self):
            return Booking.objects.filter(attendee=self.request.user, event__status="COMPLETED")
class MyUpcomingBookingsView(generics.ListAPIView):
    serializer_class=BookingSerializer
    permission_classes=[IsAuthenticated]
    def get_queryset(self):
            return Booking.objects.filter(attendee=self.request.user, event__status="PUBLISHED")
class MyCancelledBookingsView(generics.ListAPIView):
    serializer_class=BookingSerializer
    permission_classes=[IsAuthenticated]
    def get_queryset(self):
        return Booking.objects.filter(attendee=self.request.user, event__status="CANCELLED")
class SingleBookingDetailsView(generics.RetrieveAPIView):
    serializer_class=BookingSerializer
    permission_classes=[IsAuthenticated]
    def get_queryset(self):
        return Booking.objects.filter(attendee=self.request.user)

class BookingsForOrganizerView(generics.ListAPIView):
    serializer_class=BookingSerializer
    permission_classes=[IsAuthenticated, IsEventOrganizer]
    def get_queryset(self):
        return Booking.objects.filter(event=self.kwargs["event_id"])
