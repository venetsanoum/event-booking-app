from django_filters import rest_framework as filters
from .models import Event, Category
from django.db.models import Q, Case, When, IntegerField, OuterRef, Exists
class EventFilter(filters.FilterSet):
    search_bar=filters.CharFilter(method="search_filter")
    category=filters.ModelMultipleChoiceFilter(queryset=Category.objects.all(), distinct=True)
    min_price=filters.NumberFilter(field_name="ticket_types__price", lookup_expr="gte", distinct=True)
    max_price=filters.NumberFilter(field_name="ticket_types__price", lookup_expr="lte", distinct=True)
    from_date=filters.DateFilter(field_name="startDateTime", lookup_expr="gte")
    to_date=filters.DateFilter(field_name="endDateTime", lookup_expr="lte")
    city=filters.CharFilter(field_name="city", lookup_expr="icontains")

    # search bar που δέχεται τίτλο, περιγραφή, κατηγορία
    def search_filter(self, queryset, name, value):
        queryset=queryset.filter(Q(title__icontains=value)
                               | Q(description__icontains=value)
                               | Q(category__name__icontains=value))
        queryset = queryset.annotate(
            relevance=Case(
                # όταν εμφανίζεται ο τιτλος στο search bar θέλω να εμφανίζονται αυτά τα events πιο πάνω από τα άλλα
                When(title__icontains=value, then=3),
                # έπειτα αν περιέχονται σε κατηγορία
                When(category__name__icontains=value, then=2),
                # και τελευταία σε περιγραφή
                When(description__icontains=value, then=1),
                default=0,
                output_field=IntegerField(),
            )
        ).order_by("-relevance") # το order by κάνει αύξουσα ταξινόμηση άρα -relevance
        return queryset.distinct()
    class Meta:
        model=Event
        fields=["category", "city", "from_date", "min_price", "max_price"]
