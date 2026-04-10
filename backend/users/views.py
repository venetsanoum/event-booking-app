from rest_framework import generics, status
from rest_framework.response import Response
from .serializers import RegisterSerializer, LoginSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
# ουσιαστικά φτιάχνω ενα view που ακολουθεί το create object μέσω API
# εδω θέλουμε endpoint τύπου create για την εγγραφή
class RegisterView(generics.CreateAPIView):
    # ποιος serializer θα χρησιμοποιηθεί σε αυτό το view
    serializer_class = RegisterSerializer

    # override την default create
    # request: το HTTP request που ηρθε απο το frontend
    def create(self, request, *args, **kwargs):
        # δημιουργεί instances του serializer που ορίστηκε πριν
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
# θα επιστρέψει response και status code μόνο του
# επισης δεν χρειαζεται post, το κανει μόνο του 
# παιρνει request, φτιαχνει serializer καλεί τη validate
# και επιστρέφει tokens αν πήγαν όλα καλά
class LoginView(TokenObtainPairView):
    serializer_class = LoginSerializer