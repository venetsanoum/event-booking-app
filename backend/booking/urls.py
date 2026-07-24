from django.urls import path
from .views import CreateBookingView

urlpatterns=[
    path("create/<int:event_id>/", CreateBookingView.as_view()),
]