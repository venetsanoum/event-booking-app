from django.urls import path
from .views import RegisterView, LoginView, MeView, UsersListView, UserInfoView

urlpatterns = [
    # τοπικο route θα προσθεθει το register αρα θα έχουμε /api/users/register/
    path("users/register/", RegisterView.as_view(), name="register"),
    path("users/login/", LoginView.as_view(), name="login"),
    path("users/me/", MeView.as_view(), name="me"),
    path("admin/users/", UsersListView.as_view(), name="users-list"),
    path("admin/users/<int:pk>/", UserInfoView.as_view(), name="user-info"),
]