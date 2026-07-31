from rest_framework import serializers
from .models import Booking, BookingItems
""" 
    Διαχείριση Κρατήσεων 
                            """
class BookingItemSerializer(serializers.ModelSerializer):
    class Meta:
        model=BookingItems
        fields=["ticket_type", "number"]

class BookingSerializer(serializers.ModelSerializer):
    items=BookingItemSerializer(many=True, read_only=True)
    class Meta:
        model=Booking
        fields="__all__"

class CreateBookingSerializer(serializers.ModelSerializer):
    items=BookingItemSerializer(many=True)
    class Meta:
        model=Booking
        fields="__all__"
        read_only_fields=["attendee", "cost", "status", "event", "time"]
    def validate(self, args):
        for item in args["items"]:
            if(item["number"] > item["ticket_type"].available):
                raise serializers.ValidationError("Too many tickets of this type")
            if(item["number"] <= 0):
                raise serializers.ValidationError("Number of tickets must be positive")
        return args
