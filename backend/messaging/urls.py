from django.urls import path
from .views import SendMessageView, InboxView, SentView, UnreadView, UnreadCountView, MessageDetailsView
urlpatterns=[
    path("<int:pk>/", SendMessageView.as_view(), name="send-message"),
    path("inbox/", InboxView.as_view(), name="inbox"),
    path("sent/", SentView.as_view(), name="sent"),
    path("unread/", UnreadView.as_view(), name="unread"),
    path("unread-count/", UnreadCountView.as_view(), name="unread-count"),
    path("<int:pk>/", MessageDetailsView.as_view(), name="message-details")
]