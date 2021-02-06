from django.contrib import admin
from django.urls import include, path
from rest_framework import routers

from ml_flow_vcs import views as api_views

router = routers.DefaultRouter()
router.register(r'get_cookie', api_views.GetCookieViewSet)
router.register(r'user', api_views.UserViewSet)
router.register(r'comp_server', api_views.ComputationalServerViewSet)
router.register(r'flow', api_views.FlowViewSet)
router.register(r'flow_version', api_views.FlowVersionViewSet)
router.register(r'team', api_views.TeamViewSet)
router.register(r'request', api_views.RequestViewSet)
router.register(r'flow_version_json', api_views.FlowVersionJsonViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('easy_flow/v1/', include(router.urls)),
    path('easy_flow/v1/login/', api_views.LogIn.as_view(),
         name='login'),
    path('easy_flow/v1/logout/', api_views.LogOut.as_view(),
         name='logout'),
    path('easy_flow/v1/user_create/', api_views.UserCreate.as_view(),
         name='user_create'),
    path('easy_flow/v1/comp_server_add/', api_views.ComputationalServerCreate.as_view(),
         name='comp_server_add'),
    path('easy_flow/v1/comp_server_remove/', api_views.ComputationalServerRemove.as_view(),
         name='comp_server_remove'),
    path('easy_flow/v1/flow_create/', api_views.FlowCreate.as_view(),
         name='flow_create'),
    path('easy_flow/v1/flow_execute/', api_views.FlowExecute.as_view(),
         name='flow_execute'),
    path('easy_flow/v1/flow_remove/', api_views.FlowRemove.as_view(),
         name='flow_remove'),
    path('easy_flow/v1/flow_version_create/', api_views.FlowVersionCreate.as_view(),
         name='flow_version_create'),
    path('easy_flow/v1/flow_version_edit/', api_views.FlowVersionUpdate.as_view(),
         name='flow_version_edit'),
    path('easy_flow/v1/flow_version_execute/', api_views.FlowVersionExecute.as_view(),
         name='flow_version_execute'),
    path('easy_flow/v1/team_create/', api_views.TeamCreate.as_view(),
         name='team_create'),
    path('easy_flow/v1/add_member/', api_views.TeamUpdate.as_view(),
         name='add_member'),
    path('easy_flow/v1/request_create/', api_views.RequestCreate.as_view(),
         name='request_create'),
    path('easy_flow/v1/request_approve/', api_views.RequestUpdate.as_view(),
         name='request_approve')
    ]
