from rest_framework import generics, status
from rest_framework.response import Response # το αντικειμενο του θα επιστρέφει το api
from .serializers import RegisterSerializer, LoginSerializer, MyProfileSerializer, UsersListSerializer, UserInfoSerializer, UserApprovalSerializer
from .serializers import PendingUsersSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAuthenticated
from .permissions import IsAppAdmin
from .models import CustomUser
# ουσιαστικά φτιάχνω ενα view που ακολουθεί το create object μέσω API
# εδω θέλουμε endpoint τύπου create για την εγγραφή
# POST /register/
class RegisterView(generics.CreateAPIView):
    # ποιος serializer θα χρησιμοποιηθεί σε αυτό το view
    serializer_class = RegisterSerializer

    # override την default create. Καλειται αυτοματα οταν γινει POST
    # request: το HTTP request που ηρθε απο το frontend
    def create(self, request, *args, **kwargs):
        # δημιουργεί instances του serializer που ορίστηκε πριν. request.data: το DRF το εχει μετατρέψει αυτοματα σε python object
        serializer = self.get_serializer(data=request.data)
        # ελεγχει αν υπαρχουν τα απαραίτητα fields στον serializer, 
        # αν ειναι σωστοί οι τύποι και αν περνάει το validate που εγραψα
        # αν κατι ειναι invalid δεν συνεχίζει
        serializer.is_valid(raise_exception=True)
        # αποθήκευση δεδομένων. Ο serializer καλεί το create φτιαχνει custom user
        # κανει set_password και κανει save
        serializer.save()

        # εδω ειναι το JSON response που θα παρει το frontend
        return Response(
            {
                "message": "Η αίτηση εγγραφής καταχωρήθηκε και αναμένει έγκριση από διαχειριστή."
            },
            status=status.HTTP_201_CREATED # δημιουργία νέου χρήστη
        )
# θα επιστρέψει response και status code by default
# POST /login/
class LoginView(TokenObtainPairView):
    serializer_class = LoginSerializer

# GET /me/
class MyProfileView(generics.RetrieveAPIView):
    serializer_class = MyProfileSerializer
    permission_classes = [IsAuthenticated] # κανόνες πρόσβασης ενός view
    # request.user: περιέχει τον χρήστη που αντιστοιχεί στο token που έστειλε το request
    def get_object(self):
        return self.request.user
# GET /users/
class UsersListView(generics.ListAPIView):
    serializer_class = UsersListSerializer
    permission_classes = [IsAppAdmin]
    queryset = CustomUser.objects.all()
# GET /users/{id}
class UserInfoView(generics.RetrieveAPIView):
    serializer_class = UserInfoSerializer
    permission_classes = [IsAppAdmin]
    queryset = CustomUser.objects.all()
# PATCH /api/admin/users/{id}/approval/ (approval νέου χρήστη από τον admin)
class UserApprovalView(generics.UpdateAPIView):
    serializer_class=UserApprovalSerializer
    permission_classes =[IsAppAdmin]
    queryset = CustomUser.objects.all()
# GET /api/admin/users/pending
class PendingUsersView(generics.ListAPIView):
    serializer_class = PendingUsersSerializer
    permission_classes =[IsAppAdmin]
    queryset = CustomUser.objects.filter(approval_status="PENDING")
