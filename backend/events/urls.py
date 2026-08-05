from django.urls import path
from .views import CreateEventView, TicketTypeView, EventImageView, MyEventsView, EditEventView, AllTicketTypesView
from .views import SearchEventView, AddCategoryView, AllCategoriesView, AllEventsView, EventDetailsView, MyDraftEventsView
urlpatterns=[
    path("", CreateEventView.as_view(), name="event-creation"), # δημιουργια νεας εκδηλωσης
    path("<int:pk>/ticket-types/", TicketTypeView.as_view(), name="ticket-types"), # εισαγωγη τυπου εισιτηριου
    path("<int:pk>/images/", EventImageView.as_view(), name="images"), # εισαγωγη εικονας
    path("my-events/", MyEventsView.as_view(), name="my-events"), # προβολη ολων των published εκδηλωσεων ενος οργανωτη
    path("my-drafted-events/", MyDraftEventsView.as_view(), name="my-drafted-events"), # προβολη ολων των drafted εκδηλωσεων ενος οργανωτη
    path("<int:pk>/edit/", EditEventView.as_view(), name="edit-event"), # επεξεργασια εκδηλωσης που ειναι draft
    path("search/", SearchEventView.as_view(), name="search"), # αναζητηση
    path("category/", AddCategoryView.as_view(), name="category"), # νεα κατηγορια απο τον admin
    path("category-list/", AllCategoriesView.as_view(), name="category-list"), # προβολή ολων των κατηγοριων απο τον admin
    path("all/", AllEventsView.as_view(), name="all"), # λιστα με ολα τα events
    path("details/<int:pk>/", EventDetailsView.as_view(), name="details"), # λεπτομερειες για καποιο event
    path("all-ticket-types/", AllTicketTypesView.as_view(), name="all-ticket-types"),
]