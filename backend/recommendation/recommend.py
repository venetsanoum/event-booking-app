from train import train
import numpy as np
import pandas as pd
# πρόβλεψη με βάση το μοντέλο 
def predict(model, user_id, event_id):
    return(model.m + model.bi[user_id] + model.cj[event_id] + np.dot(model.v[user_id], model.f[event_id]))
# η συνάρτηση αποκλείει το train_S ώστε να ελεγξει αν τα θετικά events του test_S εμφανίζονται στα recommendations
def evaluate(user_id, K):
    model, users_map, events_map, train_S, test_S = train()
    if user_id not in users_map:
        return
    user_ptr=users_map[user_id]
    actual_pref={event_ptr for i, event_ptr, pref in test_S if i == user_ptr and pref == 1.0}
    seen={event_ptr for i, event_ptr, pref in train_S if i == user_ptr}

    scores=[]
    for event_id, event_ptr in events_map.items():
        if event_ptr in seen:
            continue
        score=predict(model, user_ptr, event_ptr)
        scores.append((event_id, event_ptr, score))
    scores.sort(key=lambda x: x[2], reverse=True)
    top=scores[:K]
    recommended={event_ptr for _, event_ptr, _ in top}
    hits=actual_pref & recommended
    if len(actual_pref) > 0:
        recall = len(hits) / len(actual_pref)
    else:
        recall = 0.0
    print("user: ", user_id)
    print("actual: ", actual_pref)
    print("top K: ", {event for event, _, _ in top})
    print("hits: ", hits)
    print("recall@{}:". format(K), recall)
def recommend(model, users_map, events_map, train_S, user_id, K):
    if user_id not in users_map:
        return []
    user_ptr=users_map[user_id]

    events=pd.read_csv("recommendation/rel_event_csvs/events.csv", usecols=["event_id"])
    # αποκλείει το training history
    seen={event_ptr for i, event_ptr, pref in train_S if i == user_ptr}

    scores=[]
    for _, event in events.iterrows():
        event_id = int(event["event_id"])
        if event_id not in events_map:
            continue
        event_ptr = events_map[event_id]
        if event_ptr not in seen:
            continue
        score=predict(model, user_ptr, event_ptr)
        scores.append((event_id, score))
    # sort με βάση το σκορ
    scores.sort(key=lambda x: x[1], reverse=True)
    return scores[:K]
def main():
    model, users_map, events_map, train_S, test_S = train()
    id=20546
    recommendations = recommend(model, users_map, events_map, train_S, id, 5)
    print(recommendations)
    evaluate(id, 5)

if __name__ == "__main__":
    main()