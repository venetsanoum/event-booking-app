from django.shortcuts import render

# Create your views here.
from django.shortcuts import render
from rest_framework import generics
from .serializers import MessageSerializer, MessageInfoSerializer
from .permissions import canSendMessage
from rest_framework.permissions import IsAuthenticated
from events.models import Event
from .models import Message
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import Http404
# Create your views here.

# POST /messages/{eventid}
class SendMessageView(generics.CreateAPIView):
    serializer_class=MessageSerializer
    permission_classes=[IsAuthenticated, canSendMessage]
    def perform_create(self, serializer):
        event_id=self.kwargs["pk"]
        event=Event.objects.get(id=event_id)
        serializer.save(sender=self.request.user, event=event)
# GET /messages/inbox
class InboxView(generics.ListAPIView):
    serializer_class=MessageInfoSerializer
    permission_classes=[IsAuthenticated]
    def get_queryset(self):
        return Message.objects.filter(receiver=self.request.user)
# GET /messages/sent
class SentView(generics.ListAPIView):
    serializer_class=MessageInfoSerializer
    permission_classes=[IsAuthenticated]
    def get_queryset(self):
        return Message.objects.filter(sender=self.request.user)
# GET /messages/unread
class UnreadView(generics.ListAPIView):
    serializer_class=MessageInfoSerializer
    permission_classes=[IsAuthenticated]
    def get_queryset(self):
        return Message.objects.filter(
            receiver=self.request.user,
            isRead=False
        )
# GET /messages/unread-count
class UnreadCountView(APIView):
    permission_classes=[IsAuthenticated]
    def get(self, request):
        count=Message.objects.filter(receiver=request.user, isRead=False).count()
        return Response({
            "unread":count
        })
# GET /messages/{id}
class MessageDetailsView(generics.RetrieveAPIView):
    serializer_class=MessageInfoSerializer
    permission_classes=[IsAuthenticated]
    def get_queryset(self):
        return Message.objects.filter(receiver=self.request.user)
    def retrieve(self, request, *args, **kwargs):
        instance=self.get_object()
        if instance.isRead == False:
            instance.isRead=True # read το μηνυμα αφου το ανοιξει
            instance.save()
        serializer=self.get_serializer(instance)
        return Response(serializer.data)
# PATCH /messages/inbox/{id}
class DeleteMessageFromInboxView(APIView):
    permission_classes=[IsAuthenticated]
    def get_object(self, request, pk):
        try:
            return Message.objects.get(pk=pk, receiver=self.request.user, isDeletedByReceiver=False)
        except:
            raise Http404
    def patch(self, request, pk, format=None):
        message=self.get_object(request, pk)
        message.isDeletedByReceiver=True
        message.save()
        serializer=MessageInfoSerializer(message)
        return Response(serializer.data)
    
# PATCH /messages/sent/{id}
class DeleteMessageFromSentView(APIView):
    permission_classes=[IsAuthenticated]
    def get_object(self, request, pk):
        try:
            return Message.objects.get(pk=pk, sender=self.request.user, isDeletedBySender=False)
        except:
            raise Http404
    def patch(self, request, pk, format=None):
        message=self.get_object(request, pk)
        message.isDeletedBySender=True
        message.save()
        serializer=MessageInfoSerializer(message)
        return Response(serializer.data)