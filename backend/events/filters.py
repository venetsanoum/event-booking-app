from django_filters import rest_framework as filters
from .models import Event, Category
from django.db.models import Q
class EventFilter(filters.FilterSet):
    search_bar=filters.CharFilter(method="search_filter")
    category=filters.ModelMultipleChoiceFilter(queryset=Category.objects.all())
    min_price=filters.NumberFilter(field_name="ticket_types__price", lookup_expr="gte")
    max_price=filters.NumberFilter(field_name="ticket_types__price", lookup_expr="lte")
    from_date=filters.DateFilter(field_name="startDateTime", lookup_expr="gte")
    to_date=filters.DateFilter(field_name="endDateTime", lookup_expr="lte")
    city=filters.CharFilter(field_name="city", lookup_expr="icontains")

    # search bar που δέχεται τίτλο, περιγραφή, κατηγορία
    def search_filter(self, queryset, name, value):
        return queryset.filter(Q(title__icontains=value)
                               | Q(description__icontains=value)
                               | Q(category__name__icontains=value))
    class Meta:
        model=Event
        fields=["category", "city", "from_date", "min_price", "max_price"]
