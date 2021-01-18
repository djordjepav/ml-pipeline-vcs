from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.timezone import now


# DONE
class User(AbstractUser):
    STATUS_TYPES = (('offline', 0), ('online', 1))

    email = models.EmailField(unique=True)
    username = models.CharField(max_length=50, unique=True)
    status = models.IntegerField(default=0, choices=STATUS_TYPES)
    teams = models.ManyToManyField('Team', related_name='teams')
    created_teams = models.ManyToManyField('Team', related_name='created_teams')
    created_flow_versions = models.ManyToManyField('FlowVersion')
    sent_requests = models.ManyToManyField('Request', related_name='sent_requests')
    received_requests = models.ManyToManyField('Request', related_name='received_requests')


# DONE
class ComputationalServer(models.Model):
    remote_user = models.CharField(max_length=128, null=True, blank=True)
    remote_host = models.CharField(default='local', max_length=128)
    env_path = models.CharField(max_length=256)


# TODO: Edit, Execute
class FlowVersion(models.Model):
    version = models.CharField(max_length=32)
    timestamp = models.DateTimeField(default=now)
    path = models.CharField(max_length=256)
    created_by = models.ForeignKey(User, related_name='created_by', on_delete=models.CASCADE)
    flow = models.ForeignKey('Flow', on_delete=models.CASCADE)
    parent = models.ForeignKey('FlowVersion', related_name='%(class)s_parent', on_delete=models.CASCADE,
                               null=True, blank=True)
    children = models.ManyToManyField('FlowVersion', related_name='%(class)s_children')


# DONE
class Flow(models.Model):
    name = models.CharField(max_length=64)
    root = models.ForeignKey(FlowVersion, related_name='root', on_delete=models.SET_NULL, null=True,
                             blank=True)
    team = models.ForeignKey('Team', on_delete=models.CASCADE)
    timestamp = models.DateTimeField(default=now)
    computational_servers = models.ManyToManyField(ComputationalServer)


# DONE
class Team(models.Model):
    name = models.CharField(max_length=64, null=True)
    leader = models.ForeignKey(User, related_name='leader', on_delete=models.CASCADE)
    members = models.ManyToManyField(User)
    flows = models.ManyToManyField(Flow, related_name='%(class)s_flow')


# DONE
class Request(models.Model):
    from_date = models.DateTimeField(default=now)
    to_date = models.DateTimeField(default=now)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    team = models.ForeignKey(Team, on_delete=models.CASCADE)
    version = models.ForeignKey(FlowVersion, on_delete=models.CASCADE)
    computational_server = models.ForeignKey(ComputationalServer, on_delete=models.CASCADE)
    approved = models.BooleanField(default=False)
