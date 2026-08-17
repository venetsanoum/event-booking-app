from rest_framework import serializers
from .models import CustomUser # σε ποιο model αντιστοιχούν οι serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer # έτοιμος serializer του JWT
from events.models import Event, TicketType, Category, EventImage
from booking.models import Booking, BookingItems
from .validators import validate_pass_strength, validate_afm_strength, validate_phone_number_strength
""" 
ο serializer:
ελέγχει fields
κάνει validation
δημιουργεί user
αποθηκεύει στη βάση
επιστρέφει αποτέλεσμα
έχουμε 2 διαφορετικούς serializers (register και Login)
"""
# Φτιαξε serializer βασισμενο σε Django Model
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True) # δεν θα επιστραφεί στο response αυτο το πεδίο ειναι μόνο για το δεχτει το api endpoint 
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
    """ τωρα πρεπει να κανει validate τον χρήστη που κάνει εγγραφή
     args: τι εστειλε ο χρήστης """
    def validate(self, args):
        validate_pass_strength(args["password"])
        validate_afm_strength(args["afm"])
        validate_phone_number_strength(args["phone"])
        if args["password"] != args["passwordbar"]:
            raise serializers.ValidationError("Password dont match!")
        if args.get("role") == "ADMIN":
            raise serializers.ValidationError("Registration as admin is not allowed!")
        return args
    
    def create(self, validated_data):
        # δημιουργία python object
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
            #is_approved=False, # ο διοργανωτης θα κανει approve μια εγγραφή,
            approval_status="PENDING"
        )
        # κανει hash το password
        user.set_password(validated_data["password"])
        # τώρα θα γίνει save στη βάση
        user.save()
        return user # το επιστρέφει στο view
    """  το όνομα χρήστη χρησιμοποιείται
     ήδη από κάποιον άλλο χρήστη, η εφαρμογή θα πρέπει να τον προτρέπει να εισαγάγει
     ένα καινούργιο όνομα χρήστη."""
    def validate_username(self, usrnm):
        if CustomUser.objects.filter(username=usrnm).exists():
            raise serializers.ValidationError("username already exists!")
        return usrnm
# TokenObtainPairSerializer: ετοιμος serializer του JWT που παίρνει username/password
# ελέγχει αν είναι σωστά, δημιουργεί tokens
class LoginSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        # κανει authentication (βρίσκει user, ελέγχει password, δημιουργεί JWT και επιστρέφει "access", "refresh")
        data = super().validate(attrs)
        # extra κανόνας
        if not self.user.approval_status == "APPROVED" and not self.user.is_superuser:
            raise serializers.ValidationError("Access Denied!")
        # στελνω επιπλέον το ονομα και τον ρολο στο frontend
        data["username"] = self.user.username
        data["role"] = self.user.role
        return data
# η προβολή των στοιχείων προφίλ ενός χρήστη
class MyProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model=CustomUser
        fields = [
            "username",
            "email",
            "first_name",
            "last_name",
            "phone",
            "address",
            "city",
            "country",
            "afm",
            "latitude",
            "longitude",
            "role",
            "profile_photo"
        ]
class EditMyProfileSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    passwordbar = serializers.CharField(write_only=True)
    class Meta:
        model=CustomUser
        fields=[
            "username",
            "email",
            "first_name",
            "last_name",
            "password",
            "passwordbar",
            "address",
            "phone",
            "city",
            "country",
            "afm",
            "profile_photo"
        ]
    def validate(self, attrs):
        password=attrs.get("password")
        passwordbar=attrs.get("passwordbar")

        if "phone" in attrs:
            validate_phone_number_strength(attrs["phone"])
        if "afm" in attrs:
            validate_afm_strength(attrs["afm"])
        if password is not None or passwordbar is not None:
            validate_pass_strength(password)
            if password != passwordbar:
                raise serializers.ValidationError("Password dont match")
        if "username" in attrs:
            if CustomUser.objects.filter(username=attrs["username"]).exclude(id=self.instance.id).exists():
                raise serializers.ValidationError("Username already exists")
        return attrs
    def update(self, instance, validated_data):
        password=validated_data.pop("password", None)
        if password:
            instance.set_password(password)
        return super().update(instance, validated_data)
        
class UsersListSerializer(serializers.ModelSerializer):
    class Meta:
        model=CustomUser
        fields = [
            "username",
            "email",
            "first_name",
            "last_name",
            "role",
            "approval_status",
        ]
class UserInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model=CustomUser
        fields = [
            "id",
            "username",
            "email",
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
class UserApprovalSerializer(serializers.ModelSerializer):
    class Meta:
        model=CustomUser
        fields=["approval_status"]
    # only pending requests can be edited to rejected or approved
    def validate_approval_status(self, value):
        # self instance -> παλιο object απο τη βάση
        # value -> νέα τιμή
        if self.instance.approval_status != "PENDING":
            raise serializers.ValidationError("Only pending requests can be changed!")
        if value not in ["APPROVED", "REJECTED"]:
            raise serializers.ValidationError("Status can only be changed to approved or rejected")
        return value
class PendingUsersSerializer(serializers.ModelSerializer):
    class Meta:
        model=CustomUser
        fields = [
            "username",
            "email",
            "first_name",
            "last_name",
            "role",
            "approval_status",
        ]