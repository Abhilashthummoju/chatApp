from django.urls import path, include
from .views import register_view, login_view, send_interest, ReceivedInterestsView, accept_interest, reject_interest, fetch_all_users, fetch_recent_chats,fetch_chat_messages, send_chat_message

urlpatterns = [
    path('register/', register_view, name='register'),
    path('login/', login_view, name='login'),
    path('send_interest/', send_interest, name='send_interest'),
    path('received_interests/', ReceivedInterestsView.as_view(), name='received_interests'),
    path('accept_interest/<int:interest_id>/', accept_interest, name='accept_interest'),
    path('reject_interest/<int:interest_id>/', reject_interest, name='reject_interest'),
    path('users/', fetch_all_users, name='fetch_all_users'),
    path('recent-chats/', fetch_recent_chats, name='fetch_recent_chats'),
    path('chats/messages/', fetch_chat_messages, name='fetch_chat_messages'),  # Updated URL
    path('chats/send/', send_chat_message, name='send_chat_message'),  # Updated URL
]

