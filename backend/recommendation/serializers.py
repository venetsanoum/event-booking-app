from rest_framework import serializers
from events.models import Event
class RecommendSerializer(serializers.ModelSerializer):
    min_price=serializers.SerializerMethodField()
    main_photo=serializers.SerializerMethodField()
    class Meta:
        model=Event
        fields=[
            "id",
            "title",
            "startDateTime",
            "endDateTime",
            "city",
            "venue",
            "min_price",
            "main_photo"
        ]
    def get_min_price(self, obj):
        return obj.ticket_types.order_by("price").values_list("price", flat=True).first()
    def get_main_photo(self, obj):
        first_image = obj.images.first()
        if first_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(first_image.photo.url)
            return first_image.photo.url