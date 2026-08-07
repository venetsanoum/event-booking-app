# source: https://www.geeksforgeeks.org/python/custom-django-management-commands/
from django.core.management.base import BaseCommand
from events.models import Event
from django.utils import timezone

class Command(BaseCommand):
    help="Update finished events to COMPLETED"
    def handle(self, *args, **options):
        timenow=timezone.now()
        events=Event.objects.filter(
            endDateTime__lt=timenow,
            status="PUBLISHED")
        events.update(status="COMPLETED")