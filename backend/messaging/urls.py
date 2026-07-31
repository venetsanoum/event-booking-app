from django.urls import path
from .views import SendMessageView
urlpatterns=[
    path("<int:pk>/", SendMessageView.as_view(), name="send-message"),
]