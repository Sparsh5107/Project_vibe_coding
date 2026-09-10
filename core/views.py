from django.shortcuts import render, get_object_or_404, redirect
from django.contrib import messages
from django.db.models import Sum
from django.utils import timezone
from .models import Donation
from .forms import DonationForm


def home(request):
    featured_donations = Donation.objects.filter(status='AVAILABLE').order_by('-created_at')[:3]
    total_rescued = Donation.objects.filter(status='CLAIMED').aggregate(total=Sum('quantity'))['total'] or 0
    total_claims = Donation.objects.filter(status='CLAIMED').count()

    context = {
        'featured_donations': featured_donations,
        'total_rescued': total_rescued,
        'total_claims': total_claims,
    }
    return render(request, 'core/home.html', context)


def donate(request):
    if request.method == 'POST':
        form = DonationForm(request.POST)
        if form.is_valid():
            donation = form.save(commit=False)
            donation.status = 'AVAILABLE'
            donation.save()
            return redirect('donate_success', pk=donation.pk)
    else:
        form = DonationForm()

    context = {'form': form}
    return render(request, 'core/donate.html', context)


def donate_success(request, pk):
    donation = get_object_or_404(Donation, pk=pk)
    context = {'donation': donation}
    return render(request, 'core/donate_success.html', context)


def find_food(request):
    donations = Donation.objects.filter(status='AVAILABLE')
    for d in donations:
        d.priority = d.get_priority()
        d.time_left = d.time_remaining()

    context = {'donations': donations}
    return render(request, 'core/find_food.html', context)


def claim_confirm(request, pk):
    donation = get_object_or_404(Donation, pk=pk, status='AVAILABLE')
    donation.priority = donation.get_priority()
    donation.time_left = donation.time_remaining()

    context = {'donation': donation}
    return render(request, 'core/claim_confirm.html', context)


def claim_process(request, pk):
    donation = get_object_or_404(Donation, pk=pk, status='AVAILABLE')

    if request.method == 'POST':
        donation.status = 'CLAIMED'
        donation.save()
        return redirect('claim_success', pk=donation.pk)

    return redirect('claim_confirm', pk=donation.pk)


def claim_success(request, pk):
    donation = get_object_or_404(Donation, pk=pk)
    context = {'donation': donation}
    return render(request, 'core/claim_success.html', context)


def impact(request):
    total_claimed = Donation.objects.filter(status='CLAIMED').aggregate(total=Sum('quantity'))['total'] or 0
    total_connections = Donation.objects.filter(status='CLAIMED').count()
    food_saved_kg = total_claimed * 0.3

    context = {
        'total_rescued': total_claimed,
        'total_connections': total_connections,
        'food_saved_kg': food_saved_kg,
    }
    return render(request, 'core/impact.html', context)
