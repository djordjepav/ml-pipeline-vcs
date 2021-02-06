import json
import os

from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from django.utils.timezone import now
from rest_framework import generics, viewsets
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.response import Response

from . import models, serializers

fs_mount_point = os.path.join(os.path.dirname(__file__), '..', '..', '..', 'data')


# POST login/ +
class LogIn(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        user.status = 1
        user.save()

        _s = serializers.UserSerializer(user)
        token, _ = Token.objects.get_or_create(user=user)

        custom_response = {
            'token': token.key,
            'user': _s.data
            }
        return Response(custom_response)


# GET get_cookie/{id} +
class GetCookieViewSet(viewsets.ModelViewSet):
    queryset = models.User.objects.all()

    def retrieve(self, request, pk):
        user = get_object_or_404(self.queryset, pk=pk)
        _s = serializers.UserSerializer(user)

        token, _ = Token.objects.get_or_create(user=user)
        response = HttpResponse()
        response.set_cookie('token', token)
        response.set_cookie('id', _s['id'])
        response.set_cookie('email', _s['email'])
        response.set_cookie('email', _s['username'])
        response.set_cookie('first_name', _s['first_name'])
        response.set_cookie('last_name', _s['last_name'])

        return response


# POST logout/ +
class LogOut(generics.UpdateAPIView):
    def update(self, request):
        created_by = request.data['created_by']
        user = models.User.objects.get(id=created_by)
        token, _ = Token.objects.get_or_create(user=user)

        if token:
            user.auth_token.delete()
            user.status = 0
            user.save()
            response = {'detail': 'Logged out.'}
        else:
            response = {'detail': 'Not logged in.'}

        return Response(response)


# POST user_create/ +
class UserCreate(generics.ListCreateAPIView):
    authentication_classes = ()
    permission_classes = ()
    serializer_class = serializers.UserSerializer

    def create(self, request):
        data = request.data
        user = models.User(email=data['email'], username=data['username'], first_name=data['first_name'],
                           last_name=data['last_name'])
        user.set_password(data['password'])
        user.save()

        if user:
            Token.objects.create(user=user)
            token, _ = Token.objects.get_or_create(user=user)
            _s = serializers.UserSerializer(user)

            custom_response = {
                'token': token.key,
                'user': _s.data
                }
            return Response(custom_response)

        return Response({'detail': 'failed'})


# GET user/{id} +
class UserViewSet(viewsets.ModelViewSet):
    queryset = models.User.objects.all()

    def list(self, request):
        pass

    def retrieve(self, request, pk):
        queryset = models.User.objects.all()
        queryset = get_object_or_404(queryset, pk=pk)

        serializer = serializers.UserSerializer(queryset)
        return Response(serializer.data)


# POST comp_server_add/ +
class ComputationalServerCreate(generics.ListCreateAPIView):
    def create(self, request):
        data = request.data
        created_by = models.User.objects.get(id=data['created_by'])
        flow = models.Flow.objects.get(id=data['flow'])

        if flow.team.leader == created_by:
            comp_server = models.ComputationalServer(remote_user=data['remote_user'],
                                                     remote_host=data['remote_host'],
                                                     env_path=data['env_path'])
            comp_server.save()

            flow.computational_servers.add(comp_server)
            flow.save()

            serializer = serializers.ComputationalServerSerializer(comp_server)
            return Response(serializer.data)

        return Response({'detail': 'failed'})


# GET comp_server/{id} +
class ComputationalServerViewSet(viewsets.ModelViewSet):
    queryset = models.ComputationalServer.objects.all()

    def list(self, request):
        pass

    def retrieve(self, request, pk):
        queryset = models.ComputationalServer.objects.all()
        queryset = get_object_or_404(queryset, pk=pk)

        serializer = serializers.ComputationalServerSerializer(queryset)
        return Response(serializer.data)


# DELETE comp_server_remove/
class ComputationalServerRemove(generics.RetrieveDestroyAPIView):
    def destroy(self, request):
        id = request.data['comp_server']

        if models.ComputationalServer.objects.filter(pk=id).exists():
            obj = models.ComputationalServer.objects.get(id=id)
            obj.delete()

            return Response({'detail': 'success'})

        return Response({'detail': 'Computational Server does not exist.'})


# POST flow_create/ +
class FlowCreate(generics.ListCreateAPIView):
    def create(self, request):
        data = request.data
        json_flow = data['serialized_flow']

        created_by = models.User.objects.get(id=data['created_by'])
        team = models.Team.objects.get(id=data['team'])

        if team.leader == created_by:
            filename = '{0}_{1}.json'.format(json_flow['flow_name'], json_flow['flow_version'])
            filename = os.path.join(fs_mount_point, filename)

            with open(filename, 'w') as f:
                json.dump(json_flow, f, indent=4, sort_keys=True)

            flow = models.Flow(name=json_flow['flow_name'], team=team)
            flow.save()

            flow_version = models.FlowVersion(version=json_flow['flow_version'],
                                              path=filename,
                                              created_by=created_by,
                                              flow=flow,
                                              parent=None)
            flow_version.save()

            flow.root = flow_version
            flow.save()

            created_by.created_flow_versions.add(flow_version)
            created_by.save()

            flow.team.flows.add(flow)
            flow.team.save()

            serializer = serializers.FlowSerializer(flow)
            return Response(serializer.data)

        return Response({'detail': 'failed'})


# GET flow/{id} +
class FlowViewSet(viewsets.ModelViewSet):
    queryset = models.Flow.objects.all()

    def list(self, request):
        pass

    def retrieve(self, request, pk):
        queryset = models.Flow.objects.all()
        queryset = get_object_or_404(queryset, pk=pk)

        serializer = serializers.FlowSerializer(queryset)
        return Response(serializer.data)


# PUT flow_execute/
class FlowExecute(generics.UpdateAPIView):
    def update(self, request):
        data = request.data

        flow_version = models.FlowVersion.objects.get(id=data['flow_version'])
        created_by = models.User.objects.get(id=data['created_by'])
        comp_server = None

        exec = False
        if created_by == flow_version.flow.team.leader:
            comp_server = models.ComputationalServer.object.get(id=data['comp_server'])
            exec = True
        else:
            reqs = models.Request.objects.filter(created_by=created_by)
            for req in reqs:
                if req.approved and req.from_data < now() < req.to_date:
                    comp_server = req.computational_server
                    exec = True
                    break

        if exec:
            if comp_server.remote_host == 'local':
                cmd = comp_server.env_path
                # TODO: Execute flow
            # TODO: Implement remote execution

        return Response({'detail': 'success'})


# DELETE flow_remove/ +
class FlowRemove(generics.RetrieveDestroyAPIView):
    def destroy(self, request):
        id = request.data['flow']

        if models.Flow.objects.filter(pk=id).exists():
            obj = models.Flow.objects.get(id=id)
            root = obj.root
            root.delete()
            obj.delete()

            return Response({'detail': 'success'})

        return Response({'detail': 'Flow does not exist.'})


# POST flow_version_create/ +
class FlowVersionCreate(generics.ListCreateAPIView):
    def create(self, request):
        data = request.data
        json_flow = data['serialized_flow']

        created_by = models.User.objects.get(id=data['created_by'])
        prev_flow_version = models.FlowVersion.objects.get(id=data['prev_flow_version'])

        if created_by in prev_flow_version.flow.team.members.all() or \
                created_by == prev_flow_version.flow.team.leader:
            filename = '{0}_{1}.json'.format(json_flow['flow_name'], json_flow['flow_version'])
            filename = os.path.join(fs_mount_point, filename)

            with open(filename, 'w') as f:
                json.dump(json_flow, f, indent=4, sort_keys=True)

            flow_version = models.FlowVersion(version=json_flow['flow_version'],
                                              path=filename,
                                              created_by=created_by,
                                              flow=prev_flow_version.flow,
                                              parent=prev_flow_version)
            flow_version.save()

            prev_flow_version.children.add(flow_version)
            prev_flow_version.save()

            created_by.created_flow_versions.add(flow_version)
            created_by.save()

            serializer = serializers.FlowVersionSerializer(flow_version)
            return Response(serializer.data)

        return Response({'detail': 'failed'})


# PUT flow_version_edit/ +
class FlowVersionUpdate(generics.UpdateAPIView):
    def update(self, request):
        data = request.data
        json_flow = data['serialized_flow']

        created_by = models.User.objects.get(id=data['created_by'])
        flow_version = models.FlowVersion.objects.get(id=data['flow_version'])

        if created_by == flow_version.created_by:
            filename = '{0}_{1}.json'.format(json_flow['flow_name'], json_flow['flow_version'])
            filename = os.path.join(fs_mount_point, filename)

            with open(filename, 'w') as f:
                json.dump(json_flow, f, indent=4, sort_keys=True)

            serializer = serializers.FlowVersionSerializer(flow_version)
            return Response(serializer.data)

        return Response({'detail': 'failed'})


# PUT flow_version_execute/
class FlowVersionExecute(generics.UpdateAPIView):
    def update(self, request):
        data = request.data

        created_by = models.User.objects.get(id=data['created_by'])
        flow_version = models.FlowVersion.objects.get(id=data['flow_version'])
        comp_server = models.ComputationalServer.objects.get(id=data['comp_server'])
        req = None

        if data['request']:
            req = models.Request.objects.get(id=data['request'])

        if created_by == flow_version.created_by or \
                (req.created_by == created_by and req.approved and req.from_date <= now() <= req.to_date):

            env_path = os.path.join(comp_server.env_path, 'bin', 'python')
            run_path = os.path.join(os.path.dirname(__file__), '..', '..', 'ml_flow_manager', 'scripts', 'run_flow.py')
            flow_path = os.path.abspath(flow_version.path)

            env_path = env_path.replace(' ', '\\ ')
            run_path = run_path.replace(' ', '\\ ')
            flow_path = flow_path.replace(' ', '\\ ')

            cmd = '{0} {1} {2}'.format(env_path, run_path, flow_path)
            print("RUNNING: ", cmd)
            os.system(cmd)

            return Response({'detail': 'success'})

        return Response({'detail': 'failed'})


# GET flow_version/{id} +
class FlowVersionViewSet(viewsets.ModelViewSet):
    queryset = models.FlowVersion.objects.all()

    def list(self, request):
        pass

    def retrieve(self, request, pk):
        queryset = models.FlowVersion.objects.all()
        queryset = get_object_or_404(queryset, pk=pk)

        serializer = serializers.FlowVersionRecursiveSerializer(queryset)
        return Response(serializer.data)


# GET flow_version_json/{id} +
class FlowVersionJsonViewSet(viewsets.ModelViewSet):
    queryset = models.FlowVersion.objects.all()

    def list(self, request):
        pass

    def retrieve(self, request, pk):
        queryset = models.FlowVersion.objects.all()
        queryset = get_object_or_404(queryset, pk=pk)

        filename = queryset.path

        with open(filename, 'r') as f:
            response = json.load(f)

        return Response(response)


# POST team_create/ +
class TeamCreate(generics.ListCreateAPIView):
    def create(self, request):
        data = request.data
        created_by = models.User.objects.get(id=data['created_by'])

        team = models.Team(name=data['name'], leader=created_by)
        team.save()
        team.members.add(created_by)
        team.save()

        created_by.created_teams.add(team)
        created_by.save()

        serializer = serializers.TeamSerializer(team)
        return Response(serializer.data)


# GET team/{id} +
class TeamViewSet(viewsets.ModelViewSet):
    queryset = models.Team.objects.all()

    def list(self, request):
        pass

    def retrieve(self, request, pk):
        queryset = models.Team.objects.all()
        queryset = get_object_or_404(queryset, pk=pk)

        serializer = serializers.TeamSerializer(queryset)
        return Response(serializer.data)


# PUT add_member/ +
class TeamUpdate(generics.UpdateAPIView):
    def update(self, request):
        data = request.data

        team = models.Team.objects.get(id=data['team'])
        leader = models.User.objects.get(id=data['created_by'])
        member = models.User.objects.get(email=data['user'])


        if team.leader == leader:
            team.members.add(member)
            team.save()
            member.teams.add(team)
            member.save()

            return Response({'detail': 'success'})

        return Response({'detail': 'Request does not exist.'})


# POST request_create/ +
class RequestCreate(generics.ListCreateAPIView):
    def create(self, request):
        data = request.data
        created_by = models.User.objects.get(id=data['created_by'])
        flow_version = models.FlowVersion.objects.get(id=data['flow_version'])
        comp_server = models.ComputationalServer.objects.get(id=data['comp_server'])

        if created_by in flow_version.flow.team.members.all() and \
                created_by != flow_version.flow.team.leader:
            req = models.Request(from_date=data['from_date'],
                                 to_date=data['to_date'],
                                 created_by=created_by,
                                 team=flow_version.flow.team,
                                 version=flow_version,
                                 computational_server=comp_server)
            req.save()

            created_by.sent_requests.add(req)
            created_by.save()

            flow_version.flow.team.leader.received_requests.add(req)
            flow_version.flow.team.leader.save()

            serializer = serializers.RequestSerializer(req)
            return Response(serializer.data)

        return Response({'detail': 'failed'})


# PUT request_approve/ +
class RequestUpdate(generics.UpdateAPIView):
    def update(self, request):
        id = request.data['request']
        approve = request.data['approve']

        if models.Request.objects.filter(pk=id).exists():
            if approve:
                req = models.Request.objects.get(id=id)
                req.approved = True
                req.save()

                req.team.leader.received_requests.remove(req)
                req.team.leader.save()

            return Response({'detail': 'success'})

        return Response({'detail': 'Request does not exist.'})


# GET request/{id} +
class RequestViewSet(viewsets.ModelViewSet):
    queryset = models.Request.objects.all()

    def list(self, request):
        pass

    def retrieve(self, request, pk):
        queryset = models.Request.objects.all()
        queryset = get_object_or_404(queryset, pk=pk)

        serializer = serializers.RequestSerializer(queryset)
        return Response(serializer.data)
