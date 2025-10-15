from django.contrib import admin
from .models import Simulation


@admin.register(Simulation)
class SimulationAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'algorithm', 'path_found', 'nodes_explored', 'execution_time', 'created_at']
    list_filter = ['algorithm', 'path_found', 'created_at']
    search_fields = ['user__username', 'algorithm']
    readonly_fields = ['created_at']
    date_hierarchy = 'created_at'
    ordering = ('-created_at',)
