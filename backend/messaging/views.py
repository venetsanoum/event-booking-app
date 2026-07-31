from django.shortcuts import render

# Create your views here.
from django.shortcuts import render
from rest_framework import generics
from .serializers import MessageSerializer
from .permissions import canSendMessage
from rest_framework.permissions import IsAuthenticated
from events.models import Event
# Create your views here.
# POST /messages/{id}
class SendMessageView(generics.CreateAPIView):
    serializer_class=MessageSerializer
    permission_classes=[IsAuthenticated, canSendMessage]
    def perform_create(self, serializer):
        event_id=self.kwargs["pk"]
        event=Event.objects.get(id=event_id)
        serializer.save(sender=self.request.user, event=event)