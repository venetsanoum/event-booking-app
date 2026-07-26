from django.urls import path
from .views import CreateBookingView, MyBookingsView, SingleBookingDetailsView

urlpatterns=[
    path("create/<int:event_id>/", CreateBookingView.as_view()),
    path("my-bookings/", MyBookingsView.as_view()),
    path("<int:pk>/", SingleBookingDetailsView.as_view()),
    
]