from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('donate/', views.donate, name='donate'),
    path('donate/success/<int:pk>/', views.donate_success, name='donate_success'),
    path('find-food/', views.find_food, name='find_food'),
    path('claim/<int:pk>/', views.claim_confirm, name='claim_confirm'),
    path('claim/<int:pk>/process/', views.claim_process, name='claim_process'),
    path('claim/<int:pk>/success/', views.claim_success, name='claim_success'),
    path('impact/', views.impact, name='impact'),
]