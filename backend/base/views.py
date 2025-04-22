from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from .serializers import UserRegistrationSerializer, UserSerializer, NoteSerializer
from .models import Note

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        # Set username to email before saving
        email = serializer.validated_data['email']
        serializer.validated_data['username'] = email
        
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        response = Response({
            'success': True,
            'message': 'User registered successfully'
        }, status=status.HTTP_201_CREATED)
        response.set_cookie('refresh_token', str(refresh), httponly=True, samesite='Strict')
        response.set_cookie('access_token', str(refresh.access_token), httponly=True, samesite='Strict')
        return response
    return Response({'success': False, 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    email = request.data.get('email')
    password = request.data.get('password')
    
    if not email or not password:
        return Response({'success': False, 'message': 'Please provide both email and password'}, 
                        status=status.HTTP_400_BAD_REQUEST)
    
    # Authenticate using email as username
    user = authenticate(username=email, password=password)
    
    if user is not None:
        refresh = RefreshToken.for_user(user)
        response = Response({
            'success': True,
            'message': 'Login successful',
            'first_name': user.first_name
        })
        response.set_cookie('refresh_token', str(refresh), httponly=True, samesite='Strict')
        response.set_cookie('access_token', str(refresh.access_token), httponly=True, samesite='Strict')
        return response
    else:
        return Response({'success': False, 'message': 'Invalid email or password'}, 
                        status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def logout_view(request):
    response = Response({'success': True, 'message': 'Logged out successfully'})
    response.delete_cookie('refresh_token')
    response.delete_cookie('access_token')
    return response

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def authenticated_view(request):
    if request.user.is_authenticated:
        return Response({
            'success': True,
            'first_name': request.user.first_name,
            'authenticated': True
        })
    else:
        return Response({
            'success': False,
            'authenticated': False,
            'message': 'User not authenticated'
        }, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET', 'POST'])
@permission_classes([permissions.IsAuthenticated])
def notes_view(request):
    if request.method == 'GET':
        notes = Note.objects.filter(user=request.user)
        serializer = NoteSerializer(notes, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = NoteSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)