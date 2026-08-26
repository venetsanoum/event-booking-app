from rest_framework import serializers
from .models import Event, TicketType, EventImage, Category, EventView
from django.utils import timezone
from users.utils.geocoding import get_coordinates
""" 
    Διαχείριση Εκδηλώσεων 
                            """
class CreateEventSerializer(serializers.ModelSerializer):
    class Meta:
        model=Event
        fields="__all__"
        read_only_fields=["organizer", "latitude", "longitude", "status"]
    def validate(self, args):
        if(args["startDateTime"] > args["endDateTime"]):
            raise serializers.ValidationError("Start DateTime must be before end DateTime")
        if(args["capacity"] <= 0):
            raise serializers.ValidationError("Capacity must be a positive integer")
        if(args["startDateTime"] < timezone.now()): # !!
            raise serializers.ValidationError("Start date cannot be in the past")
        return args
    def create(self, validated_data):
        categories=validated_data.pop("category",[])
        latitude, longitude = get_coordinates(validated_data.get("address", ""), validated_data.get("city", ""), validated_data.get("country", ""))
        event=Event(**validated_data, latitude=latitude, longitude=longitude)
        event.save()
        event.category.set(categories)
        return event
class CreateDraftEventSerializer(serializers.ModelSerializer):
    class Meta:
        model=Event
        fields="__all__"
        read_only_fields=["organizer", "latitude", "longitude", "status"]
    def create(self, validated_data):
        address=validated_data.get("address")
        city=validated_data.get("city")
        country=validated_data.get("country")
        latitude=None
        longitude=None
        if address and city and country:
            latitude, longitude = get_coordinates(validated_data.get("address", ""), validated_data.get("city", ""), validated_data.get("country", ""))
        categories=validated_data.pop("category",[])
        event=Event(**validated_data, latitude=latitude, longitude=longitude)
        event.save()
        event.category.set(categories)
        return event
class EventImageSerializer(serializers.ModelSerializer):
    class Meta:
        model=EventImage
        fields="__all__"
        read_only_fields=["event"]
# ---------------- Category Serializer ---------------- #
class CategoryInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model=Category
        fields="__all__"
# ---------------- Ticket Type Serializers ---------------- #
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
        if args["quantity"] <= 0:
            raise serializers.ValidationError("Quantity must be a positive integer")
        if args["price"] <= 0:
            raise serializers.ValidationError("Price must be positive")
        # για ό,τι είναι ήδη στη βάση αποθηκευμένο
        for ticket in event.ticket_types.all():
            total += ticket.quantity
        if(total + args["quantity"]> event.capacity):
            raise serializers.ValidationError("Quantity of all ticket types cannot exceed total capacity of the event")
        return args
class TicketTypeInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model=TicketType
        fields="__all__"
class TicketTypeEditSerializer(serializers.ModelSerializer):
    class Meta:
        model=TicketType
        fields=[
            "name",
            "price",
            "quantity"
        ]
    def validate(self, args):
        ticket_type=self.instance
        event=ticket_type.event
        id=ticket_type.id
        new_quantity=args.get("quantity", ticket_type.quantity)
        new_price=args.get("price", ticket_type.price)
        capacity=event.capacity
        other_tickets=event.ticket_types.exclude(id=id)
        sold=ticket_type.quantity-ticket_type.available
        if new_quantity < sold:
            raise serializers.ValidationError("New quantity is less than already sold tickets")
        total_quant=sum(tick.quantity for tick in other_tickets)
        if total_quant + new_quantity > capacity:
            raise serializers.ValidationError("With new quantity, the total quantity of ticket types has exceeded total capacity of the event")
        if new_quantity <= 0:
            raise serializers.ValidationError("Quantity must be positive")
        if new_price <= 0:
            raise serializers.ValidationError("Price must be positive")
        return args
    def update(self, instance, validated_data):
        if "quantity" in validated_data:
            old_quant=instance.quantity
            new_quant=validated_data["quantity"]
            sold=old_quant-instance.available
            instance.available=new_quant-sold
        return super().update(instance, validated_data)
# ------------------------------------------------------------------------- #
class EditEventSerializer(serializers.ModelSerializer):
    ticket_types=TicketTypeInfoSerializer(many=True)
    category=serializers.PrimaryKeyRelatedField(queryset=Category.objects.all(), many=True, required=False)
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
            "ticket_types"
        ]
    def validate(self, args):
        event=self.instance
        new_capacity=args.get("capacity", event.capacity)
        total_quant = sum(tick.quantity for tick in event.ticket_types.all())
        sold=sum(tick.quantity-tick.available for tick in event.ticket_types.all())
        if new_capacity < total_quant:
            raise serializers.ValidationError("New capacity is lower than current tickets quantity")
        if new_capacity < sold:
            raise serializers.ValidationError("New capacity cannot be lower than the number of already sold tickets")
        new_start=args.get("startDateTime", event.startDateTime)
        new_end=args.get("endDateTime", event.endDateTime)
        if new_start > new_end:
            raise serializers.ValidationError("Start date time must be before end date time")
        return args
class SearchEventSerializer(serializers.ModelSerializer):
    category=CategoryInfoSerializer(read_only=True, many=True)
    class Meta:
        model=Event
        fields=["title", "category", "eventType","venue",
        "address", "city", "country","startDateTime","endDateTime",
        "description",]
        #ordering=["startDateTime"]
class EventInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model=Event
        fields="__all__"
class EventDetailsSerializer(serializers.ModelSerializer):
    ticket_types=TicketTypeInfoSerializer(many=True, read_only=True)
    images=EventImageSerializer(many=True, read_only=True)
    category=CategoryInfoSerializer(many=True, read_only=True)
    reserved=serializers.SerializerMethodField()
    class Meta:
        model=Event
        fields=[
            "id",
            "title",
            "capacity",
            "reserved",
            "category",
            "description",
            "startDateTime",
            "endDateTime",
            "status",
            "venue",
            "address",
            "country",
            "city",
            "latitude",
            "longitude",
            "ticket_types",
            "images"
        ]
    def get_reserved(self, obj):
        return sum(tick.quantity-tick.available for tick in obj.ticket_types.all())
class EventViewSerializer(serializers.ModelSerializer):
    class Meta:
        model=EventView
        fields="__all__"