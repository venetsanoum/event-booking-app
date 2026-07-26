from django.shortcuts import render
from rest_framework import generics, status
from .serializers import CreateBookingSerializer
from rest_framework.response import Response
from events.models import Event
from django.utils.timezone import now
# Create your views here.
class CreateBookingView(generics.CreateAPIView):
    serializer_class=CreateBookingSerializer
    def create(self, request, *args, **kwargs):
        event_id=self.kwargs["event_id"]
        event=Event.objects.get(id=event_id)
        serializer=self.get_serializer(data=request.data) # το view φτιάχνει serializer
        serializer.is_valid(raise_exception=True)
        ticket_type=serializer.validated_data["ticket_type"]
        number=serializer.validated_data["number"]
        price=ticket_type.price
        cost=number * price
        # δημιουργία του αντικειμένου
        serializer.save(attendee=request.user,
                        event=event,
                        cost=cost,
                        status="PENDING",
                        time=now()
                        ) 
        return Response(
            {
                "message": "First step of booking creation is complete"
            },
            status=status.HTTP_201_CREATED 
        )