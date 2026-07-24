from rest_framework import serializers
from .models import Booking
""" 
    Διαχείριση Κρατήσεων 
                            """
class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model=Booking
        fields="__all__"

class CreateBookingSerializer(serializers.ModelSerializer):
    class Meta:
        model=Booking
        fields="__all__"
        read_only_fields=["attendee", "cost", "status", "event", "time"]
    def validate(self, args):
        if(args["number"] <= 0):
            raise serializers.ValidationError("Number of people attending must be positive")
        if(args["number"] > args["ticket_type"].available):
            raise serializers.ValidationError("Not enough tickets of this type")
        return args