import numpy as np
from data import load_interactions
from model import BiasedMatrixFactorization
from sklearn.model_selection import train_test_split
# Χωρισμός του S σε train και test. Χωρίζω το σύνολο των αλληλεπιδράσεων κάθε χρήστη σε train και test όχι όλο το set μονομιας.
def split_S(S):
    train=[]
    test=[]
    users_ptr = set(i for i, _, _ in S)
    for id in users_ptr:
        user_interactions=[interaction for interaction in S if interaction[0] == id]
        if len(user_interactions) < 2:
            train.extend(user_interactions)
            continue
        user_train, user_test = train_test_split(user_interactions, test_size=0.2, random_state=42)
        train.extend(user_train)
        test.extend(user_test)
    return train, test
# υπολογισμός RMSE
def rmse(model, S):
    if not S:
        return 0.0
    total_error=0.0
    for i, j, pref in S:
        prediction=model.m + model.bi[i] + model.cj[j] + np.dot(model.v[i], model.f[j])
        total_error += (pref - prediction) ** 2
    return np.sqrt(total_error / len(S))
def train():
    S, users, events = load_interactions()
    train_S, test_S = split_S(S) # πρέπει να κάνω split το S σε train και test sets
    n_users=len(users)
    n_events=len(events)
    my_model=BiasedMatrixFactorization(n_users, n_events, 10)
    epochs=30 # πόσες φορές θα περάσει όλο το train_S
    hta=0.01 # το η του ψευδοκώδικα - learning rate
    lamda=0.005 # το λ του ψευδοκώδικα
    # μέσος όρος
    m=sum(pref for _, _, pref in train_S)/len(train_S)
    my_model.m=m
    for epoch in range(epochs):
        total_error=0
        for i,j, pref in train_S:
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
        train_rmse = rmse(my_model, train_S)
        test_rmse = rmse(my_model, test_S)
        print(f"Epoch {epoch + 1}: objective = {total_obj:.4f}"
              f" train RMSE: {train_rmse:.4f}"
              f" test RMSE: {test_rmse:.4f}")
    return my_model, users, events, train_S, test_S
            
def main():
   model = train()
if __name__ == "__main__":
    main()