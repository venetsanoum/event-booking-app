from events.models import EventView
from booking.models import Booking
def load_interactions():
    bookings=Booking.objects.all() # ιστορικό κρατήσεων
    views=EventView.objects.all() # ιστορικό επισκέψεων
    interactions={}
    for view in views:
        key=(view.user_id, view.event_id)
        interactions[key]=0.3
    for booking in bookings:
        key=(booking.attendee_id, booking.event_id)
        interactions[key] = 1
    user_ids=sorted(set(user_id for user_id, _ in interactions.keys()))
    event_ids=sorted(set(event_id for _, event_id in interactions.keys()))
    users_map={
        user_id : i
        for i, user_id in enumerate(user_ids)
    }
    events_map={
        event_id : i
        for i, event_id in enumerate(event_ids)
    }
    S =[(users_map[user_id], events_map[event_id], pref) for (user_id, event_id), pref in interactions.items()]
    return S, users_map, events_map
