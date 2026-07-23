from rest_framework import serializers
from .models import Booking
""" 
    Διαχείριση Κρατήσεων 
                            """
class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model=Booking
        fields="__all__"