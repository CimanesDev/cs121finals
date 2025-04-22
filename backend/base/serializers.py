from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Note, UserProfile

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    birthday = serializers.DateField(required=True)
    
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'password', 'birthday']
        
    def create(self, validated_data):
        birthday = validated_data.pop('birthday')
        email = validated_data['email']
        
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError({'email': 'A user with this email already exists.'})
        
        user = User(
            username=email,
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        user.set_password(validated_data['password'])
        user.save()
        
        UserProfile.objects.create(user=user, birthday=birthday)
        return user

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name']

class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ['id', 'description']