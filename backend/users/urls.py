from django.urls import path
from .views import RegisterView, LoginView, MyProfileView, UsersListView, UserInfoView, UserApprovalView, PendingUsersView, LogoutView, EditMyProfileView

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("me/", MyProfileView.as_view(), name="me"),
    path("me/edit/", EditMyProfileView.as_view(), name="me-edit"),
    path("admin/users/", UsersListView.as_view(), name="users-list"),
    path("admin/users/<int:pk>/", UserInfoView.as_view(), name="user-info"),
    path("admin/users/<int:pk>/approval/", UserApprovalView.as_view(), name="user-approval"),
    path("admin/users/pending/", PendingUsersView.as_view(), name="pending-users"),
]   
