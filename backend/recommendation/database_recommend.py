from recommendation.evaluate import predict
from events.models import Event
from booking.models import Booking
from django.utils import timezone
from django.db.models import Count
# αν ο χρήστης δεν έχει ιστορικό προβολών-κρατήσεων τυπώνονται τα 5 events με τα περισσότερα views
def most_viewed_events(K):
    events=Event.objects.filter(status="PUBLISHED", startDateTime__gt=timezone.now())
    events=events.annotate(view_count=Count("views"))
    events=events.order_by("-view_count")
    events=events[:K]
    return[
        (event, event.view_count) for event in events
    ]
def recommend(model, users_map, events_map, S, user_id, K):
    if user_id not in users_map:
        return most_viewed_events(K)
    user_ptr=users_map[user_id]
    seen={event_ptr for i, event_ptr, _ in S if i==user_ptr} # τα events με τα οποία έχει ήδη αλληλεπιδράσει ο τρέχον χρήστης
    known_event_ids={event_id for event_id, _ in events_map.items()} # όλα τα γνωστά στον BMF αλγόριθμο events
    events=Event.objects.filter(id__in=known_event_ids,
                                status="PUBLISHED",
                                startDateTime__gt=timezone.now())
    scores=[]
    for event in events:
        event_ptr = events_map[event.id]
        if event_ptr in seen:
            continue
        score=predict(model, user_ptr, event_ptr)
        scores.append((event, score))
    # sort με βάση το σκορ
    scores.sort(key=lambda x: x[1], reverse=True)
    return scores[:K]