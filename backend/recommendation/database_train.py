import numpy as np
from database_data import load_interactions
from model import BiasedMatrixFactorization

def train():
    S, users, events = load_interactions()
    n_users=len(users)
    n_events=len(events)
    my_model=BiasedMatrixFactorization(n_users, n_events, 10)
    epochs=23 # πόσες φορές θα περάσει όλο το S
    hta=0.005 # το η του ψευδοκώδικα - learning rate, πόσο μεγάλο update κάνουμε
    lamda=0.05 # το λ του ψευδοκώδικα. Πόσο περιορίζουμε τις παραμέτρους
    # μέσος όρος
    m=sum(pref for _, _, pref in S)/len(S)
    my_model.m=m
    for epoch in range(epochs):
        total_error=0
        for i,j, pref in S:
            prediction = my_model.m + my_model.bi[i] + my_model.cj[j] + np.dot(my_model.v[i], my_model.f[j])

            error = pref - prediction
            total_error += error ** 2

            my_model.bi[i]=my_model.bi[i] + hta * (error - (lamda * my_model.bi[i]))
            my_model.cj[j]=my_model.cj[j] + hta * (error - (lamda * my_model.cj[j]))
            v_old=my_model.v[i].copy()
            f_old=my_model.f[j].copy()
            my_model.v[i]=v_old + hta * ((error * f_old) - (lamda * v_old))
            my_model.f[j]=f_old + hta * ((error * v_old) - (lamda * f_old))
        regularization = (np.sum(my_model.v ** 2) + np.sum(my_model.f ** 2) + np.sum(my_model.bi ** 2) + np.sum(my_model.cj ** 2))
        total_obj = total_error + (lamda / 2) * regularization
    return my_model, users, events, S
            
def main():
   model = train()
if __name__ == "__main__":
    main()