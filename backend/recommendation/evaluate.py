import numpy as np
# πρόβλεψη με βάση το μοντέλο 
def predict(model, user_id, event_id):
    return(model.m + model.bi[user_id] + model.cj[event_id] + np.dot(model.v[user_id], model.f[event_id]))
# Αξιολόγηση του μοντέλου με βάση precision@10 και recall@10
def evaluate(model, users_map, events_map, train_S, test_S, k=10):
    # τα γνωστά στον BMF events
    train_events={event_ptr for _, event_ptr, _ in train_S}
    precisions=[]
    recalls=[]
    hits=[]
    for _, user_ptr in users_map.items():
        # θέλω να βρω για τον συγκεκριμένο χρήστη ποια events στο test_S έχουν θετική αξιολόγηση και 
        # επιτρέπεται να χρησιμοποιηθούν για την αξιολόγηση 
        actual_positive={
            event_ptr 
            for i, event_ptr, rating in test_S
            if i == user_ptr
            and rating == 1.0
            and event_ptr in train_events # κράτα το συγκεκριμένο test event μόνο αν έχει εμφανιστεί τουλάχιστον μια φορά στο training set,
            # γιατί θέλουμε να αξιολογήσουμε την ικανότητα του μοντέλου να προβλέπει μια νέα προτίμηση για ένα event που έχει ήδη δει κατα την 
            # εκπαίδευση
        }
        if not actual_positive:
            continue
        # τα events που έχει ήδη αξιολογήσει ο αλγόριθμος για έναν συγκεκριμένο χρήστη
        seen={event_ptr for i, event_ptr, pref in train_S if i == user_ptr}
        scores=[]
        for event_id, event_ptr in events_map.items():
            if event_ptr in seen:
                continue
            score=predict(model, user_ptr, event_ptr)
            scores.append((event_ptr, score))
        scores.sort(key=lambda x: x[1], reverse=True)
        top=scores[:k]
        recommended = [event_ptr for event_ptr, _ in top]
        # hits = τα events που είναι στο actual_positive και που προτάθηκαν εν τέλει στον χρήστη
        hits=[event_ptr for event_ptr in recommended
              if event_ptr in actual_positive]
        precision_k = len(hits)/k
        recall_k= len(hits) / len(actual_positive)
        precisions.append(precision_k)
        recalls.append(recall_k)
    metrics={
        f"Precision@{k}":np.mean(precisions),
        f"Recall@{k}":np.mean(recalls),
        "User evaluated": len(recalls)
    }
    return metrics