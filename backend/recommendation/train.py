import numpy as np
from .data import load_interactions
from .model import BiasedMatrixFactorization

def train():
    S, users, events = load_interactions()
    n_users=len(users)
    n_events=len(events)
    my_model=BiasedMatrixFactorization(n_users, n_events, 10)
    epochs=10
    # μέσος όρος
    m=sum(pref for _, _, pref in S)/len(S)
    my_model.m=m
    print(m)
    for epoch in range(epochs):
        for i,j, pref in S:
            perdiction = my_model.m + my_model.bi[i] + my_model.cj[j] + np.dot(my_model.v[i], my_model.f[j])
            error = pref - perdiction
            # TODO: updates

