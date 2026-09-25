import re
from rest_framework import serializers

def validate_pass_strength(password):
    if len(password)<12:
        raise serializers.ValidationError("Ο κωδικός πρέπει να περιλαμβάνει τουλάχιστον 12 χαρακτήρες.")
    if not re.search(r"[A-Z]", password):
        raise serializers.ValidationError("Ο κωδικός πρέπει να έχει τουλάχιστον ένα κεφαλαίο γράμμα.")
    if not re.search(r"[^A-Za-z0-9]", password):
        raise serializers.ValidationError("Ο κωδικός πρέπει να έχει τουλάχιστον ένα σύμβολο.")
    return password
def validate_phone_number_strength(phone):
    if not re.fullmatch(r"\d{10}", phone):
        raise serializers.ValidationError("Το τηλέφωνο πρέπει να έχει ακριβώς 10 ψηφία.")
def validate_afm_strength(afm):
    if not re.fullmatch(r"\d{9}", afm):
        raise serializers.ValidationError("Το ΑΦΜ πρέπει να έχει ακριβώς 9 ψηφία.")