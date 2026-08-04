from rest_framework import serializers
from .models import Booking, BookingItems
from users.models import CustomUser
""" 
    Διαχείριση Κρατήσεων 
                            """
class BookingItemSerializer(serializers.ModelSerializer):
    class Meta:
        model=BookingItems
        fields=["ticket_type", "number"]
class BookerSerializer(serializers.ModelSerializer):
    class Meta:
        model=CustomUser
        fields=[
            "username",
            "first_name",
            "last_name",
            "email"
        ]
class BookingSerializer(serializers.ModelSerializer):
    items=BookingItemSerializer(many=True, read_only=True)
    attendee=BookerSerializer(read_only=True)
    class Meta:
        model=Booking
        fields="__all__"

class CreateBookingSerializer(serializers.ModelSerializer):
    items=BookingItemSerializer(many=True)
    class Meta:
        model=Booking
        fields="__all__"
        read_only_fields=["attendee", "cost", "event", "time"]
    def validate(self, args):
        for item in args["items"]:
            if(item["number"] > item["ticket_type"].available):
                raise serializers.ValidationError("Too many tickets of this type")
            if(item["number"] <= 0):
                raise serializers.ValidationError("Number of tickets must be positive")
        return args
