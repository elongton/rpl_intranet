from django.db import models

# Create your models here.
class RemoteAPI(models.Model):
    name = models.CharField(max_length=255)
    client_id = models.CharField(max_length=255)
    grant_type = models.CharField(max_length=255)
    client_secret = models.CharField(max_length=500)
    def __str__(self):
        return self.name
