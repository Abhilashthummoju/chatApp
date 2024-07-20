from django.contrib.auth.models import User
from django.db import models
from django.utils import timezone

class Interest(models.Model):
    from_user = models.ForeignKey(User, related_name='sent_interests', on_delete=models.CASCADE)
    to_user = models.ForeignKey(User, related_name='received_interests', on_delete=models.CASCADE)
    created_at = models.DateTimeField(default=timezone.now)

class ChatRoom(models.Model):
    user1 = models.ForeignKey(User, related_name='chatrooms_user1', on_delete=models.CASCADE)
    user2 = models.ForeignKey(User, related_name='chatrooms_user2', on_delete=models.CASCADE)
    created_at = models.DateTimeField(default=timezone.now)

class Message(models.Model):
    room = models.ForeignKey(ChatRoom, related_name='messages', on_delete=models.CASCADE)
    sender = models.ForeignKey(User, related_name='sent_messages', on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(default=timezone.now)
