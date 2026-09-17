from django.core.management.base import BaseCommand
from recommendation.database_train import train
class Command(BaseCommand):
    help="This command trains the BMF model"
    def handle(self, *args, **options):
        train()
        self.stdout.write(self.style.SUCCESS("Model is trained"))
    