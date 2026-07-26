from django.urls import path
from .views import CreateBookingView, MyBookingsView

urlpatterns=[
    path("create/<int:event_id>/", CreateBookingView.as_view()),
    path("my-bookings/", MyBookingsView.as_view()),
]