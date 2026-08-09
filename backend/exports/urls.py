from django.urls import path
from .views import ExportXMLView, ExportJSONView

urlpatterns = [
    path("xml/", ExportXMLView.as_view(), name="xml"),
    path("json/", ExportJSONView.as_view(), name="json")
]  