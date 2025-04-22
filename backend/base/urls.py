from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

urlpatterns = [
    path('register/', views.register_user, name='register'),
    path('token/', views.login_view, name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', views.logout_view, name='logout'),
    path('authenticated/', views.authenticated_view, name='authenticated'),
    path('notes/', views.notes_view, name='notes'),
]