from rest_framework import serializers
from .models import CustomUser
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
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
            "longitude",
            "role"
        ]
# μέχρι εδω ο serializer δεχεται JSON, το συνδεει με CustomUser και ξέρει ποια fields επιτρέπονται
    # τωρα πρεπει να κανει validate τον χρήστη που κάνει εγγραφή
    # args: τι εστειλε ο χρήστης
    def validate(self, args):
        if args["password"] != args["passwordbar"]:
            raise serializers.ValidationError("Password dont match!")
        if args.get("role") == "ADMIN":
            raise serializers.ValidationError("Registration as admin is not allowed!")
        return args
    
    def create(self, validated_data):
        user = CustomUser(
            username=validated_data["username"],
            email=validated_data.get("email", ""),
            first_name=validated_data.get("first_name", ""),
            last_name=validated_data.get("last_name", ""),
            phone=validated_data.get("phone", ""),
            address=validated_data.get("address", ""),
            city=validated_data.get("city", ""),
            country=validated_data.get("country", ""),
            afm=validated_data.get("afm", ""),
            latitude=validated_data.get("latitude", None),
            longitude=validated_data.get("longitude", None),
            role=validated_data.get("role", ""),
            is_approved=False, # ο διοργανωτης θα κανει approve μια εγγραφή
        )
        # κανει hash το password
        user.set_password(validated_data["password"])
        user.save()

        return user
# TokenObtainPairSerializer: ετοιμος serializer του JWT που παίρνει username/password
# ελέγχει αν είναι σωστά, δημιουργεί tokens
class LoginSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        # κανει authentication
        data = super().validate(attrs)
        if not self.user.is_approved and not self.user.is_superuser:
            raise serializers.ValidationError("Access Denied!")\
        # στελνω ονομα και ρολο στο frontend
        data["username"] = self.user.username
        data["role"] = self.user.role
        return data


