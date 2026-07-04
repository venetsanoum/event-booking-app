from django.urls import path
from .views import RegisterView, LoginView, MyProfileView, UsersListView, UserInfoView, UserApprovalView, PendingUsersView

urlpatterns = [
    # τοπικο route θα προσθεθει το register αρα θα έχουμε /api/users/register/
    path("users/register/", RegisterView.as_view(), name="register"),
    path("users/login/", LoginView.as_view(), name="login"),
    path("users/profile/", MyProfileView.as_view(), name="profile"),
    path("admin/users/", UsersListView.as_view(), name="users-list"),
    path("admin/users/<int:pk>/", UserInfoView.as_view(), name="user-info"),
    path("admin/users/<int:pk>/approval/", UserApprovalView.as_view(), name="user-approval"),
    path("admin/users/pending/", PendingUsersView.as_view(), name="pending-users")
]
#eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzgzMTY1Mzg3LCJpYXQiOjE3ODMxNjUwODcsImp0aSI6ImM1MmJhNDJlM2RjNTRmNjY5M2IyN2RiYzNkNTc4Y2U5IiwidXNlcl9pZCI6IjIifQ.9zQDLeIgNirNw63sPFQD0lSNm0A6qOHP2aBj8aiAH2k