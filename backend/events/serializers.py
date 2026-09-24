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
            raise serializers.ValidationError("Η ημερομηνία έναρξης πρέπει να είναι πριν την ημερομηνία λήξης.")
        if(args["capacity"] <= 0):
            raise serializers.ValidationError("Η χωρητικότητα πρέπει να είναι θετικός αριθμός.")
        if(args["startDateTime"] < timezone.now()): # !!
            raise serializers.ValidationError("Η ημερομηνία έναρξης δεν μπορεί να είναι στο παρελθόν.")
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
            raise serializers.ValidationError("Η ποσότητα πρέπει να είναι θετικός αριθμός.")
        if args["price"] <= 0:
            raise serializers.ValidationError("Η τιμή πρέπει να είναι θετικός αριθμός.")
        # για ό,τι είναι ήδη στη βάση αποθηκευμένο
        for ticket in event.ticket_types.all():
            total += ticket.quantity
        if(total + args["quantity"]> event.capacity):
            raise serializers.ValidationError("Το άθροισμα όλων των εισιτηρίων δεν μπορεί να ξεπερνάει τη συνολική χωρητικότητα.")
        return args
class TicketTypeInfoSerializer(serializers.ModelSerializer):
    reserved=serializers.SerializerMethodField()
    class Meta:
        model=TicketType
        fields=["id",
                "name",
                "price",
                "quantity",
                "available",
                "reserved"]
    def get_reserved(self, obj):
        return obj.quantity-obj.available

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
            raise serializers.ValidationError("Η νεά ποσότητα εισιτηίου είναι μικρότερη από τα ειστήρια που έχουν ήδη πωληθεί.")
        total_quant=sum(tick.quantity for tick in other_tickets)
        if total_quant + new_quantity > capacity:
            raise serializers.ValidationError("Με τη νέα ποσότητα, ο συνολικός αριθμών εισιτηρίων ξεπερνάει τη συνολική χωρητικότητα.")
        if new_quantity <= 0:
            raise serializers.ValidationError("Η ποσότητα πρέπει να είναι θετική.")
        if new_price <= 0:
            raise serializers.ValidationError("Η τιμή πρέπει να είναι θετικός αριθμός.")
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
        read_only_fields=["latitude", "longitude"]
    def validate(self, args):
        event=self.instance
        new_capacity=args.get("capacity", event.capacity)
        total_quant = sum(tick.quantity for tick in event.ticket_types.all())
        sold=sum(tick.quantity-tick.available for tick in event.ticket_types.all())
        if new_capacity < total_quant:
            raise serializers.ValidationError("Η νέα χωρητικότητα είναι μικρότερη από τον συνολικό αριθμό των εισιτηρίων.")
        if new_capacity < sold:
            raise serializers.ValidationError("Η νέα χωρητικότητα δεν μπορεί να είναι μικρότερη από τον συνολικό αριθμό των εισιτηρίων που έχουν ήδη πωληθεί.")
        new_start=args.get("startDateTime", event.startDateTime)
        new_end=args.get("endDateTime", event.endDateTime)
        if new_start > new_end:
            raise serializers.ValidationError("Η ημερομηνία έναρξης πρέπει να είναι πριν την ημερομηνία λήξης.")
        return args
    def update(self, instance, validated_data):
        address=validated_data.get("address", instance.address)
        city=validated_data.get("city", instance.city)
        country=validated_data.get("country", instance.country)
        if address != instance.address or city!= instance.city or country !=instance.country:
            latitude, longitude=get_coordinates(address, city, country)
            instance.latitude=latitude
            instance.longitude=longitude
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
class SearchEventSerializer(serializers.ModelSerializer):
    category = CategoryInfoSerializer(read_only=True, many=True)
    main_photo = serializers.SerializerMethodField()
    lowest_price = serializers.SerializerMethodField()
    class Meta:
        model = Event
        fields = ["id", "title", "category", "eventType", "venue",
        "address", "city", "country", "startDateTime", "endDateTime",
        "description", "main_photo", "lowest_price"]
    def get_main_photo(self, obj):
        first_image = obj.images.first()
        if first_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(first_image.photo.url)
            return first_image.photo.url
        return None
    def get_lowest_price(self, obj):
        tickets = obj.ticket_types.all()
        if not tickets:
            return None
        return min(ticket.price for ticket in tickets)
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
    available=serializers.SerializerMethodField()
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
            "images",
            "available"
        ]
    def get_reserved(self, obj):
        return sum(tick.quantity-tick.available for tick in obj.ticket_types.all())
    def get_available(self, obj):
            return sum(tick.available for tick in obj.ticket_types.all())
class EventViewSerializer(serializers.ModelSerializer):
    class Meta:
        model=EventView
        fields="__all__"