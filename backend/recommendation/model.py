import numpy as np
class BiasedMatrixFactorization:
    def __init__(self, n_users, n_events, k):
        self.n_users=n_users
        self.n_events=n_events
        self.k=k
        self.m=0.0
        self.bi=np.zeros(n_users)
        self.cj=np.zeros(n_events)
        # αρχικοποίηση V και F με τυχαίες μικρές τιμές
        self.v=np.random.normal(0, 0.01, (n_users, k))
        self.f=np.random.normal(0, 0.01, (n_events, k))
        pass
