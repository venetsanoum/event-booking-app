from rest_framework import serializers
from .models import Message
from events.models import Event
from users.models import CustomUser
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
class UserInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ["id", "username", "first_name", "last_name", "profile_photo"]
class MessageInfoSerializer(serializers.ModelSerializer):
    event = EventInfoSerializer(read_only=True)
    sender = UserInfoSerializer(read_only=True)
    receiver = UserInfoSerializer(read_only=True)
    class Meta:
        model = Message
        fields = "__all__"
