from rest_framework import serializers
from .models import Booking, BookingItems
from users.models import CustomUser
from events.models import Event
""" 
    Διαχείριση Κρατήσεων 
                            """
class BookingItemSerializer(serializers.ModelSerializer):
    ticket_name = serializers.CharField(source="ticket_type.name", read_only=True)
    ticket_price = serializers.DecimalField(source="ticket_type.price", max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = BookingItems
        fields = ["ticket_type", "number", "ticket_name", "ticket_price"]
class BookerSerializer(serializers.ModelSerializer):
    class Meta:
        model=CustomUser
        fields=[
            "username",
            "first_name",
            "last_name",
            "email"
        ]
class EventSerializer(serializers.ModelSerializer):
    main_photo = serializers.SerializerMethodField()
    class Meta:
        model = Event
        fields = [
            "id",
            "title",
            "startDateTime",
            "endDateTime",
            "venue",
            "address",
            "city",
            "country",
            "main_photo",
        ]
    def get_main_photo(self, obj):
        first_image = obj.images.first()
        if first_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(first_image.photo.url)
            return first_image.photo.url
        return None
class BookingSerializer(serializers.ModelSerializer):
    items=BookingItemSerializer(many=True, read_only=True)
    attendee=BookerSerializer(read_only=True)
    event=EventSerializer(read_only=True)
    class Meta:
        model=Booking
        fields="__all__"

class CreateBookingSerializer(serializers.ModelSerializer):
    items=BookingItemSerializer(many=True)
    class Meta:
        model=Booking
        fields=["items"]
    def validate(self, args):
        event=self.context["event"]
        for item in args["items"]:
            if(item["number"] > item["ticket_type"].available):
                raise serializers.ValidationError(f"Ξεπεράσατε τον αριθμό των διαθέσιμων εισιτηρίων. Απομένουν μόνο {item["ticket_type"].available} εισιτήρια: {item["ticket_type"].name}")
            if(item["number"] <= 0):
                raise serializers.ValidationError("Ο αριθμός εισιτηρίων πρέπει να είναι θετικός.")
            if item["ticket_type"].event != event:
                raise serializers.ValidationError("This type of ticket does not belong to this event")
        return args
