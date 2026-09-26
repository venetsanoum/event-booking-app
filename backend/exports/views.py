from django.shortcuts import render
from rest_framework import generics
from users.permissions import IsAppAdmin
from events.models import Event
from django.http import HttpResponse
import xml.etree.ElementTree as elemnt
from .serializers import EventDetailsSerializer
from rest_framework.views import APIView
import json
# Create your views here.
# GET /exports/xml
class ExportXMLView(APIView):
    permission_classes = [IsAppAdmin]

    def get(self, request):
        events = Event.objects.filter(status__in=["PUBLISHED", "COMPLETED", "CANCELLED"])
        root = elemnt.Element("Events")
        for event in events:
            event_xml = elemnt.SubElement(
                root,
                "Event",
                EventID=f"EV{event.id}"
            )
            elemnt.SubElement(event_xml, "Title").text = event.title
            for category in event.category.all():
                elemnt.SubElement(event_xml, "Category").text = category.name

            elemnt.SubElement(event_xml, "EventType").text = event.eventType
            elemnt.SubElement(event_xml, "Venue").text = event.venue
            elemnt.SubElement(event_xml, "Address").text = event.address
            elemnt.SubElement(event_xml, "City").text = event.city
            elemnt.SubElement(event_xml, "Country").text = event.country
            elemnt.SubElement(
                event_xml,
                "GeoLocation",
                Latitude=str(event.latitude),
                Longitude=str(event.longitude)
            )
            elemnt.SubElement(
                event_xml,
                "StartDateTime"
            ).text = event.startDateTime.isoformat()
            elemnt.SubElement(
                event_xml,
                "EndDateTime"
            ).text = event.endDateTime.isoformat()
            elemnt.SubElement(
                event_xml,
                "Capacity"
            ).text = str(event.capacity)
            # TicketTypes
            ticket_types_xml = elemnt.SubElement(
                event_xml,
                "TicketTypes"
            )
            for ticket in event.ticket_types.all():
                ticket_xml = elemnt.SubElement(
                    ticket_types_xml,
                    "TicketType",
                    TicketTypeID=f"T{ticket.id}"
                )
                elemnt.SubElement(ticket_xml, "Name").text = ticket.name
                elemnt.SubElement(ticket_xml, "Price").text = str(ticket.price)
                elemnt.SubElement(ticket_xml, "Quantity").text = str(ticket.quantity)
                elemnt.SubElement(ticket_xml, "Available").text = str(ticket.available)
            # Bookings
            bookings_xml = elemnt.SubElement(
                event_xml,
                "Bookings"
            )
            for booking in event.bookings.all():
                booking_xml = elemnt.SubElement(
                    bookings_xml,
                    "Booking",
                    BookingID=f"B{booking.id}"
                )
                elemnt.SubElement(
                    booking_xml,
                    "Attendee",
                    UserID=booking.attendee.username
                )
                elemnt.SubElement(
                    booking_xml,
                    "Time"
                ).text = booking.time.isoformat()
                for item in booking.items.all():
                    elemnt.SubElement(
                        booking_xml,
                        "TicketTypeRef"
                    ).text = f"T{item.ticket_type.id}"

                    elemnt.SubElement(
                        booking_xml,
                        "NumberOfTickets"
                    ).text = str(item.number)
                elemnt.SubElement(
                    booking_xml,
                    "TotalCost"
                ).text = str(booking.cost)
                elemnt.SubElement(
                    booking_xml,
                    "BookingStatus"
                ).text = booking.status
            # Organizer
            elemnt.SubElement(
                event_xml,
                "Organizer",
                UserID=event.organizer.username
            )
            elemnt.SubElement(
                event_xml,
                "Status"
            ).text = event.status
            elemnt.SubElement(
                event_xml,
                "Description"
            ).text = event.description
            # Media
            media_xml = elemnt.SubElement(
                event_xml,
                "Media"
            )
            for image in event.images.all():
                elemnt.SubElement(
                    media_xml,
                    "Photo"
                ).text = image.photo.name
        xml = elemnt.tostring(
            root,
            encoding="utf-8",
            xml_declaration=True
        )
        response = HttpResponse(xml,content_type="application/xml")
        response["Content-Disposition"] = ('attachment; filename="events.xml"')
        return response

# GET /exports/json
class ExportJSONView(generics.ListAPIView):
    permission_classes=[IsAppAdmin]
    def get(self, request):
        events = Event.objects.filter(status__in=["PUBLISHED", "COMPLETED", "CANCELLED"])
        serializer=EventDetailsSerializer(events, many=True)
        response = HttpResponse(json.dumps(
            serializer.data
        ),
        content_type="application/json"
        )
        response["Content-Disposition"] = ('attachment; filename="events.json"')
        return response