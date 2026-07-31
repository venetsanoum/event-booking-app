from django.db import models

# Create your models here.
from django.db import models
from users.models import CustomUser
from events.models import Event

# Create your models here.
class Message(models.Model):
    sender=models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="messages_sent")
    receiver=models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="messages_received")
    event=models.ForeignKey(Event, on_delete=models.CASCADE)
    content=models.TextField()
    subject=models.CharField(max_length=200)
    sendDateTime=models.DateTimeField()
    isRead=models.BooleanField(default=False)
