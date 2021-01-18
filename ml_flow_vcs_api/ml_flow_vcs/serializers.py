from rest_framework import serializers

from . import models


class SimpleUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.User
        fields = '__all__'
        extra_kwargs = {'password': {'write_only': True}}


class ComputationalServerSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.ComputationalServer
        fields = '__all__'


class FlowVersionSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.FlowVersion
        fields = '__all__'


class FlowVersionRecursiveSerializer(serializers.ModelSerializer):
    created_by = SimpleUserSerializer()

    class Meta:
        model = models.FlowVersion
        fields = '__all__'

    def get_fields(self):
        fields = super(FlowVersionRecursiveSerializer, self).get_fields()
        fields['children'] = FlowVersionRecursiveSerializer(many=True)
        return fields


class FlowSerializer(serializers.ModelSerializer):
    root = FlowVersionSerializer()
    computational_servers = ComputationalServerSerializer(many=True)
    # team -> id

    class Meta:
        model = models.Flow
        fields = '__all__'


class TeamSerializer(serializers.ModelSerializer):
    leader = SimpleUserSerializer()
    members = SimpleUserSerializer(many=True)
    flows = FlowSerializer(many=True)

    class Meta:
        model = models.Team
        fields = '__all__'


class RequestSerializer(serializers.ModelSerializer):
    created_by = SimpleUserSerializer()
    team = TeamSerializer()
    version = FlowVersionSerializer()
    computational_server = ComputationalServerSerializer()

    class Meta:
        model = models.Request
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    teams = TeamSerializer(many=True)
    created_teams = TeamSerializer(many=True)
    created_flow_versions = FlowVersionRecursiveSerializer(many=True)
    sent_requests = RequestSerializer(many=True)
    received_requests = RequestSerializer(many=True)

    class Meta:
        model = models.User
        fields = '__all__'
        extra_kwargs = {'password': {'write_only': True}}
