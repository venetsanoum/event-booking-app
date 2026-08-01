from rest_framework import serializers
from .models import Message
class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model=Message
        fields=["receiver", "event", "subject", "content"]
class MessageInfoSerializer(serializers.ModelSerializer):
    class Meta:
        fields="__all__"
