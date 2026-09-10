from django import forms
from .models import Donation


class DonationForm(forms.ModelForm):
    class Meta:
        model = Donation
        fields = [
            'food_name', 'quantity', 'food_type', 'donor_name',
            'location', 'prepared_at', 'available_until', 'note'
        ]
        widgets = {
            'food_name': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'e.g., Vegetable Biryani'
            }),
            'quantity': forms.NumberInput(attrs={
                'class': 'form-control',
                'placeholder': 'Number of meals'
            }),
            'food_type': forms.Select(attrs={
                'class': 'form-control'
            }),
            'donor_name': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'e.g., ABC Restaurant'
            }),
            'location': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'e.g., 123 Main Street, City'
            }),
            'prepared_at': forms.DateTimeInput(attrs={
                'class': 'form-control',
                'type': 'datetime-local'
            }),
            'available_until': forms.DateTimeInput(attrs={
                'class': 'form-control',
                'type': 'datetime-local'
            }),
            'note': forms.Textarea(attrs={
                'class': 'form-control',
                'placeholder': 'Any additional notes (optional)',
                'rows': 3
            }),
        }
