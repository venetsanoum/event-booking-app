from django.urls import path
from .views import CreateEventView, TicketTypeView, EventImageView, MyEventsView, EditEventView, AllTicketTypesView
from .views import SearchEventView, AddCategoryView, AllCategoriesView, AllEventsView, EventDetailsView, MyDraftEventsView, CitiesView, EventViewView
from .views import MyCancelledEventsView, MyCompletedEventsView, AllActiveEventsView, EditTicketTypesView, EventTicketTypesView, DeleteTicketTypeView
urlpatterns=[
    path("", CreateEventView.as_view(), name="event-creation"), # δημιουργια νεας εκδηλωσης
    path("<int:pk>/ticket-types/", TicketTypeView.as_view(), name="ticket-types"), # εισαγωγη τυπου εισιτηριου
    path("<int:pk>/images/", EventImageView.as_view(), name="images"), # εισαγωγη εικονας
    path("my-events/", MyEventsView.as_view(), name="my-events"), # προβολη ολων των published εκδηλωσεων ενος οργανωτη
    path("my-drafted-events/", MyDraftEventsView.as_view(), name="my-drafted-events"), # προβολη ολων των drafted εκδηλωσεων ενος οργανωτη
    path("my-cancelled-events/", MyCancelledEventsView.as_view(), name="my-cancelled-events"), # προβολη ολων των cancelled εκδηλωσεων ενος οργανωτη
    path("my-completed-events/", MyCompletedEventsView.as_view(), name="my-completed-events"), # προβολη ολων των completed εκδηλωσεων ενος οργανωτη
    path("<int:pk>/edit/", EditEventView.as_view(), name="edit-event"), # επεξεργασια εκδηλωσης που ειναι draft
    path("search/", SearchEventView.as_view(), name="search"), # αναζητηση
    path("category/", AddCategoryView.as_view(), name="category"), # προσθήκη νεας κατηγοριας απο τον admin
    path("category-list/", AllCategoriesView.as_view(), name="category-list"), # προβολή ολων των κατηγοριων απο τον admin
    path("all/", AllEventsView.as_view(), name="all"), # λιστα με ολα τα events
    path("active/", AllActiveEventsView.as_view(), name="active"), # λιστα με ολα τα active/published events
    path("details/<int:pk>/", EventDetailsView.as_view(), name="details"), # λεπτομερειες για καποιο event
    path("all-ticket-types/", AllTicketTypesView.as_view(), name="all-ticket-types"), # όλα τα ticket types ολων των events της εφαρμογης
    path("<int:pk>/event-ticket-types/", EventTicketTypesView.as_view(), name="event-ticket-types"), # ολα τα tickettypes ενος συγκεκριμένου event
    path("<int:event_id>/ticket-types/<int:pk>/", EditTicketTypesView.as_view(), name="edit-ticket-types"), # επεξεργασια τυπου εισιτηριου
    path("<int:event_id>/delete-ticket-types/<int:pk>/", DeleteTicketTypeView.as_view(), name="delete-ticket-types"), # delete ticket type
    path("cities/", CitiesView.as_view(), name="cities"),
    path("event-view/", EventViewView.as_view(), name="views")
]