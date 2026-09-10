from django.contrib import admin
from .models import Donation


@admin.register(Donation)
class DonationAdmin(admin.ModelAdmin):
    list_display = ['food_name', 'quantity', 'donor_name', 'location', 'status', 'created_at']
    list_filter = ['status', 'food_type']
    search_fields = ['food_name', 'donor_name']
