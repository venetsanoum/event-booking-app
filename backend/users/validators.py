import re
from rest_framework import serializers

def validate_pass_strength(password):
    if len(password)<8:
        raise serializers.ValidationError("Password must contain at least 8 characters")
    if not re.search(r"[A-Z]", password):
        raise serializers.ValidationError("Password must contain at least one uppercase letter")
    if not re.search(r"[^A-Za-z0-9]", password):
        raise serializers.ValidationError("Password must contain at least one symbol.")
    return password
def validate_phone_number_strength(phone):
    if not re.fullmatch(r"\d{10}", phone):
        raise serializers.ValidationError("Phone number must contain 10 digits")
def validate_afm_strength(afm):
    if not re.fullmatch(r"\d{10}", afm):
        raise serializers.ValidationError("AFM must contain 10 digits")