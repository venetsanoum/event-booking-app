from django.shortcuts import render
from rest_framework import generics, status
from .serializers import CreateBookingSerializer, BookingSerializer
from rest_framework.response import Response
from events.models import Event, TicketType
from django.utils import timezone
from .models import Booking, BookingItems
from rest_framework.permissions import IsAuthenticated
from .permissions import IsEventOrganizer
from messaging.models import Message
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
# Create your views here.

class CreateBookingView(generics.CreateAPIView):
    serializer_class=CreateBookingSerializer
    permission_classes=[IsAuthenticated]
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
                        status="CONFIRMED",
                        time=timezone.now()
                        ) 
        for item in items:
            BookingItems.objects.create(booking=booking, ticket_type=item["ticket_type"], number=item["number"])
        confirmation_message=Message(
            subject="Επιβεβαίωση Κράτησης",
            content=f"Η κράτησή σας με αριθμό {booking.id} επιβεβαιώθηκε! Ευχαριστούμε πολύ!",
            sender=event.organizer,
            receiver=self.request.user,
            event=event,
            sendDateTime=timezone.now()
        )
        confirmation_message.save()
        return Response(
            {
                "id": booking.id,
                "message": "Πρώτο βήμα"
            },
            status=status.HTTP_201_CREATED 
        )

class MyBookingsView(generics.ListAPIView):
    serializer_class=BookingSerializer
    permission_classes=[IsAuthenticated]
    def get_queryset(self):
        return Booking.objects.filter(attendee=self.request.user).order_by("-time")
class MyCompletedBookingsView(generics.ListAPIView):
    serializer_class=BookingSerializer
    permission_classes=[IsAuthenticated]
    def get_queryset(self):
            return Booking.objects.filter(attendee=self.request.user, event__status="COMPLETED").order_by("time")
class MyUpcomingBookingsView(generics.ListAPIView):
    serializer_class=BookingSerializer
    permission_classes=[IsAuthenticated]
    def get_queryset(self):
            return Booking.objects.filter(attendee=self.request.user, event__status="PUBLISHED").order_by("-time")
class MyCancelledBookingsView(generics.ListAPIView):
    serializer_class=BookingSerializer
    permission_classes=[IsAuthenticated]
    def get_queryset(self):
        return Booking.objects.filter(attendee=self.request.user, event__status="CANCELLED").order_by("-time")
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

class CancelBooking(APIView):
    permission_classes=[IsAuthenticated, IsEventOrganizer]
    def patch(self, request, event_id, booking_id):
        event=get_object_or_404(Event, id=event_id)
        booking=get_object_or_404(Booking, id=booking_id, event=event)
        if booking.status == "CANCELLED":
            return Response(
                {"details":"Ήδη ακυρωμένη κράτηση"},
                 status=status.HTTP_400_BAD_REQUEST
            )
        booking.status="CANCELLED"
        booking.save()
        cancellation_message=Message(
            subject="Ακύρωση Εκδήλωσης",
            content=(f"Θα θέλαμε να σας ενημερώσουμε πως εξαιτίας κάποιων απρόοπτων γεγονότων η εκδήλωση: {event.title} " 
            f"που ήταν προγραμματισμένη για " 
            f"{event.startDateTime} δυστυχώς ακυρώνεται! Θα ενημερωθείτε για την "
            f"επιστροφή των χρημάτων σας. Λυπούμαστε για την αναστάτωση."),
            sender=event.organizer,
            receiver=booking.attendee,
            event=event,
            sendDateTime=timezone.now()
        )
        cancellation_message.save()
        for item in booking.items.all():
            ticket=item.ticket_type
            ticket.available+=item.number
            ticket.save()
        return Response(
            {"details":"Booking successfully cancelled"},
            status=status.HTTP_200_OK
        )
        
