import pandas as pd
def load_interactions():
    # φόρτωμα αρχείου
    event_interest=pd.read_csv("recommendation/rel_event_csvs/event_interest.csv")
    users=event_interest["user"].dropna().unique()
    # mapping users {
    # 8438 : 0
    # 32 : 1
    # ...   }
    users_mapping={
        int(user_id): index
        for index, user_id in enumerate(users)
    }

    # mapping events
    events=event_interest["event"].dropna().unique()
    events_mapping={
        int(event_id): index
        for index, event_id in enumerate(events)
    }

    interactions = event_interest[
    (
        (event_interest["interested"] == 1) |
        (event_interest["not_interested"] == 1)
    )
    &
    event_interest["user"].notna()
    &
    event_interest["event"].notna()
]
    # S: σύνολο για τα γνωστά ζεύγη χρήστη-αντικειμένου
    # Θα περιλαμβάνει [user_id, event_id, preference(1,-1)]
    S=[]
    for _, row in interactions.iterrows():
        user_id=users_mapping[int(row["user"])]
        event_id=events_mapping[int(row["event"])]
        if row["interested"] == 1:
            preference=1
        elif row["not_interested"] == 1:
            preference=-1
        S.append((user_id, event_id, preference))
    return S, users_mapping, events_mapping
