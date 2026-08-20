import pandas as pd
def load_interactions():
    # φόρτωμα αρχείου
    df=pd.read_csv("recommendation/rel_event_csvs/event_interest.csv")
    df=df[df["user"].notna() # κράτα γραμμές που έχουν user
          & df["event"].notna() # που έχουν event
          & (
              (df["interested"] == 1)   # και γραμμές που έχουν 1 είτε στο interested είτε στο not interested
              | (df["not_interested"] == 1)
          )].copy()
    # αν interested == 1 -> rating = 1.0
    # αν not_interested == 1 -> rating = 0.0
    df["rating"]=df["interested"].apply(
        lambda interested : 1.0 if interested == 1 else 0.0
    )
    user_ids=df["user"].astype(int).unique()
    event_ids=df["event"].astype(int).unique()

    # κρατάω μια γραμμή ανα ζευγάρι και συγκεκριμένα αυτή με το μεγαλύτερο rating
    df=(df.groupby(["user", "event"], as_index=False)["rating"].max())
    # mapping users {
    # 8438 : 0
    # 32 : 1
    # ...   }
    users_mapping={
        int(user_id): index
        for index, user_id in enumerate(user_ids)
    }
    # mapping events
    events_mapping={
        int(event_id): index
        for index, event_id in enumerate(event_ids)
    }
    # S: σύνολο για τα γνωστά ζεύγη χρήστη-αντικειμένου
    S = [(users_mapping[int(row.user)],
                     events_mapping[int(row.event)],
                     float(row.rating)
                    )
                    for row in df.itertuples(index=False)
                    ]
    return S, users_mapping, events_mapping
# if __name__ == "__main__":
#     S, users_mapping, events_mapping = load_interactions()

#     print("Interactions:", len(S))
#     print("Users:", len(users_mapping))
#     print("Events:", len(events_mapping))
#     print("First:", S[:10])