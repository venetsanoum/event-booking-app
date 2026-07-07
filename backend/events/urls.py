from django.urls import path
from .views import CreateEventView, TicketTypeView
urlpatterns=[
    path("", CreateEventView.as_view(), name="event-creation"),
    path("<int:pk>/ticket-types/", TicketTypeView.as_view(), name="ticket-types")
]