from django.urls import path
from . import views

urlpatterns = [
    path("catalogo/", views.vista_ssr, name="catalogo_ssr"),
]