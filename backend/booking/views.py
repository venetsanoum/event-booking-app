from django.shortcuts import render
from rest_framework import generics, status
from .serializers import CreateBookingSerializer
from rest_framework.response import Response
# Create your views here.
class CreateBookingView(generics.CreateAPIView):
    serializer_class = CreateBookingSerializer
    def create(self, request, *args, **kwargs):
        serializer=self.get_serializer(data=request.data) # το view φτιάχνει serializer
        serializer.is_valid(raise_exception=True)
        # δημιουργία του αντικειμένου
        serializer.save(attendee=request.user) 
        return Response(
            {
                "message": "First step of booking creation is complete"
            },
            status=status.HTTP_201_CREATED 
        )