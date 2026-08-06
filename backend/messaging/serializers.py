from rest_framework import serializers
from .models import Message
from events.models import Event
class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model=Message
        fields=["receiver", "event", "subject", "content"]
class EventInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model=Event
        fields=[
            "id",
            "title",
            "venue",
            "address",
            "city",
            "startDateTime"
        ]
class MessageInfoSerializer(serializers.ModelSerializer):
    event=EventInfoSerializer(serializers.ModelSerializer)
    class Meta:
        model=Message
        fields="__all__"
