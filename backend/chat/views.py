from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from django.shortcuts import get_object_or_404
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Interest, ChatRoom
from .serializers import InterestSerializer, UserSerializer, ChatRoomSerializer
from django.db.models import Q
from .models import ChatRoom, Message
from .serializers import MessageSerializer



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def fetch_chat_messages(request):
    user_id = request.data.get('user_id')
    if not user_id:
        return Response({'error': 'user_id is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    user1 = request.user
    user2 = get_object_or_404(User, id=user_id)
    chat_room = get_object_or_404(ChatRoom, Q(user1=user1, user2=user2) | Q(user1=user2, user2=user1))
    messages = Message.objects.filter(room=chat_room).order_by('created_at')
    serializer = MessageSerializer(messages, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_chat_message(request):
    user_id = request.data.get('user_id')
    message_content = request.data.get('message')
    if not user_id or not message_content:
        return Response({'error': 'user_id and message content are required'}, status=status.HTTP_400_BAD_REQUEST)
    
    user1 = request.user
    user2 = get_object_or_404(User, id=user_id)
    chat_room = get_object_or_404(ChatRoom, Q(user1=user1, user2=user2) | Q(user1=user2, user2=user1))
    message = Message.objects.create(room=chat_room, sender=user1, content=message_content)
    serializer = MessageSerializer(message)
    return Response(serializer.data, status=status.HTTP_201_CREATED)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def fetch_all_users(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True, context={'request': request})
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def fetch_recent_chats(request):
    user = request.user
    chatrooms = ChatRoom.objects.filter(Q(user1=user) | Q(user2=user))
    serializer = ChatRoomSerializer(chatrooms, many=True, context={'request': request})
    return Response(serializer.data, status=status.HTTP_200_OK)

# User Registration
@api_view(['POST'])
def register_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    email = request.data.get('email')

    if not username or not password or not email:
        return Response({'error': 'Username, password, and email are required'}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(email=email).exists():
        return Response({'error': 'Email already exists'}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(username=username, password=password, email=email)
    user.save()

    return Response({'message': 'User created successfully'}, status=status.HTTP_201_CREATED)

# User Login
@api_view(['POST'])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response({'error': 'Username and password are required'}, status=status.HTTP_400_BAD_REQUEST)

    user = authenticate(request, username=username, password=password)
    if user is not None:
        login(request, user)
        refresh = RefreshToken.for_user(user)
        print(user)
        return Response({
            'message': 'Logged in successfully',
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'username': user.username
        })
    return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)

# Send Interest
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_interest(request):
    from_user = request.user
    to_user_id = request.data.get('to_user_id')
    to_user = get_object_or_404(User, id=to_user_id)
    interest = Interest(from_user=from_user, to_user=to_user)
    interest.save()
    return Response({'message': 'Interest sent successfully'}, status=status.HTTP_201_CREATED)

# View Received Interests
class ReceivedInterestsView(generics.ListAPIView):
    serializer_class = InterestSerializer

    def get_queryset(self):
        return Interest.objects.filter(to_user=self.request.user)

# Accept Interest
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def accept_interest(request, interest_id):
    interest = get_object_or_404(Interest, id=interest_id)
    chat_room = ChatRoom(user1=interest.from_user, user2=interest.to_user)
    chat_room.save()
    interest.delete()
    return Response({'message': 'Interest accepted and chat room created'}, status=status.HTTP_201_CREATED)

# Reject Interest
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def reject_interest(request, interest_id):
    interest = get_object_or_404(Interest, id=interest_id)
    interest.delete()
    return Response({'message': 'Interest rejected'}, status=status.HTTP_204_NO_CONTENT)
