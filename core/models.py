from django.db import models
from django.utils import timezone


STATUS_CHOICES = [
    ('AVAILABLE', 'Available'),
    ('CLAIMED', 'Claimed'),
]

FOOD_TYPE_CHOICES = [
    ('prepared', 'Prepared Meals'),
    ('baked', 'Baked Goods'),
    ('produce', 'Fresh Produce'),
    ('packaged', 'Packaged Food'),
    ('beverages', 'Beverages'),
    ('other', 'Other'),
]


class Donation(models.Model):
    food_name = models.CharField(max_length=200)
    quantity = models.PositiveIntegerField()
    food_type = models.CharField(max_length=50, choices=FOOD_TYPE_CHOICES)
    donor_name = models.CharField(max_length=200)
    location = models.CharField(max_length=300)
    prepared_at = models.DateTimeField()
    available_until = models.DateTimeField()
    note = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='AVAILABLE')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.food_name} ({self.quantity} meals) - {self.donor_name}"

    def get_priority(self):
        now = timezone.now()
        remaining = self.available_until - now

        if remaining.total_seconds() <= 0:
            return {'label': 'Expired', 'class': 'expired', 'icon': '⚫'}
        elif remaining.total_seconds() <= 3600:
            return {'label': 'High Priority', 'class': 'high', 'icon': '🔥'}
        elif remaining.total_seconds() <= 10800:
            return {'label': 'Medium Priority', 'class': 'medium', 'icon': '🟠'}
        else:
            return {'label': 'Normal', 'class': 'normal', 'icon': '🟢'}

    def time_remaining(self):
        now = timezone.now()
        remaining = self.available_until - now
        total_seconds = int(remaining.total_seconds())

        if total_seconds <= 0:
            return "Expired"

        hours = total_seconds // 3600
        minutes = (total_seconds % 3600) // 60

        if hours > 0:
            return f"{hours}h {minutes}m remaining"
        return f"{minutes}m remaining"

    class Meta:
        ordering = ['-created_at']
