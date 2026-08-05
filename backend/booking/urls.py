from django.urls import path
from .views import CreateBookingView, MyBookingsView, SingleBookingDetailsView, BookingsForOrganizerView, MyCancelledBookingsView, MyCompletedBookingsView, MyUpcomingBookingsView

urlpatterns=[
    path("create/<int:event_id>/", CreateBookingView.as_view()),
    path("my-bookings/", MyBookingsView.as_view()),
    path("my-cancelled-bookings/", MyCancelledBookingsView.as_view()),
    path("my-upcoming-bookings/", MyUpcomingBookingsView.as_view()),
    path("my-completed-bookings/", MyCompletedBookingsView.as_view()),
    path("<int:pk>/", SingleBookingDetailsView.as_view()),
    path("event/<int:event_id>/", BookingsForOrganizerView.as_view()),
]