from rest_framework import serializers
from .models import Event, TicketType
""" 
    Διαχείριση Εκδηλώσεων 
                            """
# POST /api/events -> δημιουργία νέας εκδήλωσης
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
# POST /api/events/{id}/ticket-type -> τύποι εισιτηρίων για μια εκδήλωση (αφού δημιουργηθεί η εκδήλωση στη βάση)
class TicketTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = TicketType
        fields="__all__"
        read_only_fields=["event"]
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
        if(args["available"] > args["quantity"]):
            raise serializers.ValidationError("Available tickets cannot exceed quantity")
        if(total + args["quantity"]> event.capacity):
            raise serializers.ValidationError("Quantity of all ticket types cannot exceed total capacity of the event")
        return args

        