from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from recommendation.database_recommend import recommend
from recommendation.database_train import load_model

# Create your views here.
class RecommendView(APIView):
    permission_classes=[IsAuthenticated]
    def get(self, request):
        # πάρε το πιο πρόσφατα εκπαιδευμένο μοντέλο
        model, users, events, interactions = load_model()
        recommendations=recommend(model, users, events, interactions, request.user.id, 5)
        data=[{
            "event_id":event.id,
            "title":event.title,
            "score":score
        }
        for event, score in recommendations
        ]
        return Response(data)

