from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework.validators import UniqueValidator

from .models import Simulation

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model - returns basic user info"""

    class Meta:
        model = User
        fields = ["id", "username", "email", "first_name", "last_name"]
        read_only_fields = ["id"]


class RegisterSerializer(serializers.ModelSerializer):
    """Serializer for user registration"""

    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all())],
    )
    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password]
    )
    password2 = serializers.CharField(
        write_only=True, required=True, label="Confirm Password"
    )
    first_name = serializers.CharField(required=False, allow_blank=True)
    last_name = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = User
        fields = [
            "username",
            "email",
            "password",
            "password2",
            "first_name",
            "last_name",
        ]
        extra_kwargs = {
            "first_name": {"required": False},
            "last_name": {"required": False},
        }

    def validate(self, attrs):
        if attrs["password"] != attrs["password2"]:
            raise serializers.ValidationError(
                {"password": "Password fields didn't match."}
            )
        return attrs

    def create(self, validated_data):
        validated_data.pop("password2")
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            first_name=validated_data.get("first_name", ""),
            last_name=validated_data.get("last_name", ""),
        )
        user.set_password(validated_data["password"])
        user.save()
        return user


class SimulationSerializer(serializers.ModelSerializer):
    """Serializer for simulation results"""
    
    class Meta:
        model = Simulation
        fields = [
            'id', 'user', 'algorithm', 'grid_data', 'start_position', 
            'goal_position', 'heuristic', 'path_found', 'path', 'steps',
            'nodes_explored', 'path_cost', 'execution_time', 'created_at'
        ]
        read_only_fields = ['id', 'user', 'created_at']


class AlgorithmExecutionSerializer(serializers.Serializer):
    """Serializer for algorithm execution requests"""
    algorithm = serializers.ChoiceField(choices=[
        'astar', 'bfs', 'dfs', 'dijkstra', 
        'hill_climbing', 'simulated_annealing', 'genetic'
    ])
    grid = serializers.ListField(
        child=serializers.ListField(child=serializers.IntegerField())
    )
    start = serializers.ListField(
        child=serializers.IntegerField(), min_length=2, max_length=2
    )
    goal = serializers.ListField(
        child=serializers.IntegerField(), min_length=2, max_length=2
    )
    heuristic = serializers.CharField(required=False, default='manhattan')
    save_simulation = serializers.BooleanField(default=False)
