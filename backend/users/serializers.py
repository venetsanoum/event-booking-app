from rest_framework import serializers
from .models import CustomUser
# ο serializer:
# ελέγχει fields
# κάνει validation
# δημιουργεί user
# αποθηκεύει στη βάση
# επιστρέφει αποτέλεσμα

# Φτιαξε serializer βασισμενο σε Django Model
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    # για confirmation
    passwordbar = serializers.CharField(write_only=True)

    # που δουλευει ο serializer (στον CustomUser)
    class Meta:
        model=CustomUser
        # ποια πεδία δέχεται το API
        fields = [
            "username",
            "email",
            "password",
            "passwordbar",
            "first_name",
            "last_name",
            "phone",
            "address",
            "city",
            "country",
            "afm",
            "latitude",
            "logntitude",
            "role"
        ]
# μέχρι εδω ο serializer δεχεται JSON, το συνδεει με CustomUser και ξέρει ποια fields επιτρέπονται
    # τωρα πρεπει να κανει validate τον χρήστη που κάνει εγγραφή
    # args: τι εστειλε ο χρήστης
    def validate(self, args):
        if args["password"] != args["passwordbar"]:
            raise serializers.ValidationError("Password dont match!")
        if args.get("role") == "ADMIN":
            raise serializers.ValidationError("Registration as admin is now allowed!")
        return args