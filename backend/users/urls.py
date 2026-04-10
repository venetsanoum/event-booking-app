from django.urls import path
from .views import RegisterView, LoginView

urlpatterns = [
    # τοπικο route θα προσθεθει το register αρα θα έχουμε /api/users/register/
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
]