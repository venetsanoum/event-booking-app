from django.urls import path
from .views import CreateEventView, TicketTypeView, EventImageView, MyEventsView, SingleEventDetailsView, EditEventView, SearchEventView
urlpatterns=[
    path("", CreateEventView.as_view(), name="event-creation"),
    path("<int:pk>/ticket-types/", TicketTypeView.as_view(), name="ticket-types"),
    path("<int:pk>/images/", EventImageView.as_view(), name="images"),
    path("my-events/", MyEventsView.as_view(), name="my-events"),
    path("<int:pk>/bookings/", SingleEventDetailsView.as_view(), name="event-detail"),
    path("<int:pk>/edit/", EditEventView.as_view(), name="edit-event"),
    path("search/", SearchEventView.as_view(), name="search")
]