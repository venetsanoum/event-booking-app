from database_train import train
from evaluate import predict
from events.models import Event
from booking.models import Booking
from django.utils import timezone
def show_bookings():
    bookings=Booking.objects.select_related("attendee", "event").all()
    for b in bookings:
        print(f"User id: {b.attendee_id} | "
              f"Username: {b.attendee.username} | "
              f"Event id: {b.event_id} ")
def recommend(model, users_map, events_map, train_S, user_id, K):
    if user_id not in users_map:
        return []
    user_ptr=users_map[user_id]
    seen={event_ptr for i, event_ptr, _ in train_S if i==user_ptr}
    known_event_ids={event_id for event_id, _ in events_map.items()}
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
def main():
    show_bookings()
    model, users_map, events_map, S = train()
    id=1
    recommendations = recommend(model, users_map, events_map, S, id, 5)
    print(recommendations)
    # metrics=evaluate(model, users_map, events_map, train_S, test_S)
    # for name, value in metrics.items():
    #     print(f"{name}: {value:.4f}" if isinstance(value, float) else f"{name}: {value}")
if __name__ == "__main__":
    main()