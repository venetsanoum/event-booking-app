from django.urls import path
from .views import CreateBookingView, MyBookingsView, SingleBookingDetailsView, BookingsForOrganizerView

urlpatterns=[
    path("create/<int:event_id>/", CreateBookingView.as_view()),
    path("my-bookings/", MyBookingsView.as_view()),
    path("<int:pk>/", SingleBookingDetailsView.as_view()),
    path("event/int:event_id>/", BookingsForOrganizerView.as_view()),
]