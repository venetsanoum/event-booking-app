from rest_framework import serializers
from .models import Event, TicketType, EventImage, Category
from booking.serializers import BookingSerializer
""" 
    Διαχείριση Εκδηλώσεων 
                            """
class CreateEventSerializer(serializers.ModelSerializer):
    class Meta:
        model=Event
        fields="__all__"
        read_only_fields=["organizer"]
    def validate(self, args):
        if(args["startDateTime"] > args["endDateTime"]):
            raise serializers.ValidationError("Start DateTime must be before end DateTime")
        if(args["capacity"] <= 0):
            raise serializers.ValidationError("Capacity must be a positive integer")
        return args
class TicketTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = TicketType
        fields=[
            "name",
            "price",
            "quantity"
        ]
    def validate(self, args):
        # event=args["event"] λάθος γιατί:
        # το args περιέχει τα δεδομένα του request που έχουν περάσει
        # τους αρχικούς ελέγχους του serializer.
        # Δεν περιέχει δεδομένα που θα προστεθούν αργότερα μέσω του save().

        # Το event δεν υπάρχει εδώ, γιατί το:
        # serializer.save(event=event)
        # εκτελείται μετά το validate().

        # Άρα για να χρησιμοποιήσουμε το event μέσα στο validate(),
        # το περνάμε μέσω του serializer context από το view.
        event=self.context["event"]        
        total=0
        # για ό,τι είναι ήδη στη βάση αποθηκευμένο
        for ticket in event.ticket_types.all():
            total += ticket.quantity
        if(total + args["quantity"]> event.capacity):
            raise serializers.ValidationError("Quantity of all ticket types cannot exceed total capacity of the event")
        return args
class EventImageSerializer(serializers.ModelSerializer):
    class Meta:
        model=EventImage
        fields="__all__"
        read_only_fields=["event"]
class TicketTypeInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model=TicketType
        fields="__all__"
class MyEventsSerializer(serializers.ModelSerializer):
    ticket_types=TicketTypeInfoSerializer(read_only=True, many=True)
    class Meta:
        model=Event
        fields=[
            "id",
            "title",
            "startDateTime",
            "endDateTime",
            "venue",
            "address",
            "country",
            "capacity",
            "ticket_types"
        ]
class EditEventSerializer(serializers.ModelSerializer):
    class Meta:
        model=Event
        fields = [
            "id",
            "title",
            "organizer",
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
            "description",
            "status",
        ]

class SearchEventSerializer(serializers.ModelSerializer):
    class Meta:
        model=Event
        fields=["title", "category", "eventType","venue",
        "address", "city", "country","startDateTime","endDateTime",
        "description",]
        ordering=["startDateTime"]
class CategoryInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model=Category
        fields="__all__"
class EventInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model=Event
        fields="__all__"
class EventDetailsSerializer(serializers.ModelSerializer):
    ticket_types=TicketTypeInfoSerializer(many=True, read_only=True)
    image=EventImageSerializer(many=True, read_only=True)
    class Meta:
        model=Event
        fields=[
            "id",
            "title",
            "startDateTime",
            "endDateTime",
            "venue",
            "address",
            "country",
            "ticket_types",
            "image"
        ]
