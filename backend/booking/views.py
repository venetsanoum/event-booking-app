from django.shortcuts import render
from rest_framework import generics, status
from .serializers import CreateBookingSerializer, BookingSerializer
from rest_framework.response import Response
from events.models import Event
from django.utils.timezone import now
from .models import Booking, BookingItems
from rest_framework.permissions import IsAuthenticated
from .permissions import IsEventOrganizer
# Create your views here.

class CreateBookingView(generics.CreateAPIView):
    serializer_class=CreateBookingSerializer
    def create(self, request, *args, **kwargs):
        event_id=self.kwargs["event_id"]
        event=Event.objects.get(id=event_id)
        serializer=self.get_serializer(data=request.data) # το view φτιάχνει serializer
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
                        status="PENDING",
                        time=now()
                        ) 
        for item in items:
            BookingItems.objects.create(booking=booking, ticket_type=item["ticket_type"], number=item["number"])
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
