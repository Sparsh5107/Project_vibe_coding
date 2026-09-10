from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from core.models import Donation


class Command(BaseCommand):
    help = 'Seed the database with sample food donations'

    def handle(self, *args, **kwargs):
        Donation.objects.all().delete()

        now = timezone.now()

        donations = [
            Donation(
                food_name='Vegetable Biryani',
                quantity=50,
                food_type='prepared',
                donor_name='ABC Restaurant',
                location='12 MG Road, Bangalore',
                prepared_at=now - timedelta(hours=2),
                available_until=now + timedelta(minutes=30),
                note='Freshly prepared, serves 50 people',
                status='AVAILABLE'
            ),
            Donation(
                food_name='Fresh Pizza',
                quantity=30,
                food_type='prepared',
                donor_name='City Cafe',
                location='45 Park Street, Kolkata',
                prepared_at=now - timedelta(hours=1),
                available_until=now + timedelta(hours=2),
                note='Margherita and Pepperoni mix',
                status='AVAILABLE'
            ),
            Donation(
                food_name='Packed Meals',
                quantity=80,
                food_type='packaged',
                donor_name='Grand Event Hall',
                location='78 Lake Road, Mumbai',
                prepared_at=now - timedelta(hours=3),
                available_until=now + timedelta(hours=5),
                note='Rice, dal, and vegetables',
                status='AVAILABLE'
            ),
            Donation(
                food_name='Chapati & Sabzi',
                quantity=40,
                food_type='prepared',
                donor_name='Food Corner',
                location='23 Station Road, Delhi',
                prepared_at=now - timedelta(hours=1),
                available_until=now + timedelta(hours=1),
                note='Fresh hot meal, ready to serve',
                status='AVAILABLE'
            ),
            Donation(
                food_name='Sandwiches',
                quantity=25,
                food_type='prepared',
                donor_name='Campus Cafe',
                location='56 University Road, Pune',
                prepared_at=now - timedelta(hours=4),
                available_until=now + timedelta(hours=8),
                note='Veg and non-veg options',
                status='AVAILABLE'
            ),
            Donation(
                food_name='Cake & Pastries',
                quantity=15,
                food_type='baked',
                donor_name='Sweet Dreams Bakery',
                location='89 Gandhi Nagar, Chennai',
                prepared_at=now - timedelta(hours=5),
                available_until=now - timedelta(hours=1),
                note='Assorted bakery items',
                status='CLAIMED'
            ),
            Donation(
                food_name='Rice & Curry Packets',
                quantity=60,
                food_type='packaged',
                donor_name='Green Catering Services',
                location='34 Ring Road, Hyderabad',
                prepared_at=now - timedelta(hours=6),
                available_until=now - timedelta(hours=2),
                note='Packaged for individual servings',
                status='CLAIMED'
            ),
        ]

        for d in donations:
            d.save()

        self.stdout.write(self.style.SUCCESS(
            f'Successfully created {len(donations)} sample donations '
            f'({Donation.objects.filter(status="AVAILABLE").count()} available, '
            f'{Donation.objects.filter(status="CLAIMED").count()} claimed)'
        ))
