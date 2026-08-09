from rest_framework import serializers
from events.models import Event, TicketType, EventImage, Category
from booking.models import BookingItems, Booking
class TicketTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model=TicketType
        fields=[
            "id",
            "name",
            "price",
            "quantity",
            "available"
        ]
class BookingItemSerializer(serializers.ModelSerializer):
    class Meta:
        model=BookingItems
        fields=["number"]
class BookingSerializer(serializers.ModelSerializer): # DOES NOT PRINT BOOKINGS
    items=BookingItemSerializer(read_only=True, many=True)
    class Meta:
        model=Booking
        fields=[
            "id",
            "attendee",
            "time",
            "items",
            "cost"
        ]
class EventImageSerializer(serializers.ModelSerializer):
    class Meta:
        model=EventImage
        fields=["photo"]
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model=Category
        fields=["name"]
class EventDetailsSerializer(serializers.ModelSerializer):
    ticket_types=TicketTypeSerializer(many=True, read_only=True)
    images=EventImageSerializer(many=True, read_only=True)
    category=CategorySerializer(many=True, read_only=True)
    bookings=BookingSerializer(many=True, read_only=True)
    class Meta:
        model=Event
        fields=[
            "id",
            "title",
            "category",
            "eventType",
            "venue",
            "address",
            "city",
            "country",
            "latitude",
            "longitude",
            "startDateTime",
            "endDateTime",
            "capacity",
            "ticket_types",
            "bookings",
            "organizer",
            "status",
            "description",
            "images"
        ]