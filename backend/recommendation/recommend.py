from train import train
import numpy as np
import pandas as pd
from evaluate import evaluate, predict

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
        if event_ptr in seen:
            continue
        score=predict(model, user_ptr, event_ptr)
        scores.append((event_id, score))
    # sort με βάση το σκορ
    scores.sort(key=lambda x: x[1], reverse=True)
    return scores[:K]
def main():
    model, users_map, events_map, train_S, test_S = train()
    id=1
    recommendations = recommend(model, users_map, events_map, train_S, id, 5)
    print(recommendations)
    metrics=evaluate(model, users_map, events_map, train_S, test_S)
    for name, value in metrics.items():
        print(f"{name}: {value:.4f}" if isinstance(value, float) else f"{name}: {value}")
if __name__ == "__main__":
    main()