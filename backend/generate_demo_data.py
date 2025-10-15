#!/usr/bin/env python
"""
Generate demo data for Logs Dashboard

This script generates realistic sample data for testing and development purposes.
It creates users, log entries, and user filter preferences to populate the database.

Usage:
    python generate_demo_data.py                    # Default: 500 logs, 3 users
    python generate_demo_data.py --logs 1000       # Generate 1000 logs
    python generate_demo_data.py --users 5         # Generate 5 users
    python generate_demo_data.py --clear           # Clear existing data first
    python generate_demo_data.py --help            # Show help
"""

import argparse
import os
import random
import sys
from datetime import datetime, timedelta
from typing import List

# Setup Django environment before importing Django modules
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "logs_project.settings")

import django

django.setup()

# Now import Django modules after setup
from django.conf import settings
from django.contrib.auth.models import User
from django.utils import timezone
from logs_app.models import Log, UserFilterPreference


class DemoDataGenerator:
    """Generate realistic demo data for the logs dashboard."""

    # Realistic log messages for different severities
    LOG_MESSAGES = {
        "DEBUG": [
            "Database query executed successfully",
            "User session initialized",
            "Cache hit for user preferences",
            "Processing request parameters",
            "Validating input data",
            "Loading configuration settings",
            "Establishing database connection",
            "Parsing request headers",
            "Initializing security context",
            "Starting background task",
        ],
        "INFO": [
            "User login successful",
            "New user registration completed",
            "File upload completed",
            "Data export initiated",
            "System health check passed",
            "Scheduled task completed",
            "User logout processed",
            "Configuration updated",
            "Cache refresh completed",
            "Service started successfully",
            "API request processed",
            "Email notification sent",
            "Password reset requested",
            "User profile updated",
            "Search query executed",
        ],
        "WARNING": [
            "High memory usage detected",
            "Slow database query performance",
            "API rate limit approaching",
            "Deprecated feature usage detected",
            "Unusual login pattern detected",
            "Cache miss rate increasing",
            "Disk space running low",
            "Connection timeout occurred",
            "Invalid request parameters",
            "Session expiring soon",
            "Retry attempt after failure",
            "Performance threshold exceeded",
        ],
        "ERROR": [
            "Database connection failed",
            "Authentication failed for user",
            "File upload error occurred",
            "Payment processing failed",
            "API request timeout",
            "Invalid credentials provided",
            "Service unavailable",
            "Data validation failed",
            "Network connection error",
            "Permission denied for operation",
            "Resource not found",
            "Configuration file missing",
            "Third-party service error",
            "Email delivery failed",
        ],
        "CRITICAL": [
            "System out of memory",
            "Database server unresponsive",
            "Security breach detected",
            "Service completely down",
            "Data corruption detected",
            "Critical security vulnerability",
            "System overload - shutting down",
            "Hardware failure detected",
            "Backup system failure",
            "Critical configuration error",
        ],
    }

    # Realistic service sources
    SOURCES = [
        "auth_service",
        "user_management",
        "api_gateway",
        "database_service",
        "payment_processor",
        "email_service",
        "file_storage",
        "notification_service",
        "analytics_engine",
        "security_monitor",
        "web_server",
        "background_worker",
        "cache_service",
        "search_engine",
        "reporting_service",
        "backup_service",
        "monitoring_agent",
        "load_balancer",
        "cdn_service",
        "message_queue",
    ]

    # User data for demo accounts
    DEMO_USERS = [
        {
            "username": "admin",
            "email": "admin@logsdashboard.com",
            "first_name": "Admin",
            "last_name": "User",
            "is_staff": True,
            "is_superuser": True,
        },
        {
            "username": "developer",
            "email": "dev@logsdashboard.com",
            "first_name": "John",
            "last_name": "Developer",
            "is_staff": False,
            "is_superuser": False,
        },
        {
            "username": "analyst",
            "email": "analyst@logsdashboard.com",
            "first_name": "Jane",
            "last_name": "Analyst",
            "is_staff": False,
            "is_superuser": False,
        },
        {
            "username": "operator",
            "email": "ops@logsdashboard.com",
            "first_name": "Mike",
            "last_name": "Operations",
            "is_staff": False,
            "is_superuser": False,
        },
        {
            "username": "tester",
            "email": "test@logsdashboard.com",
            "first_name": "Sarah",
            "last_name": "Tester",
            "is_staff": False,
            "is_superuser": False,
        },
    ]

    # Sample filter preferences
    FILTER_PRESETS = [
        {
            "name": "Critical Issues",
            "severity": "CRITICAL",
            "source": "",
        },
        {
            "name": "Auth Service Errors",
            "severity": "ERROR",
            "source": "auth_service",
        },
        {
            "name": "Database Problems",
            "severity": "WARNING",
            "source": "database_service",
        },
        {
            "name": "All Warnings",
            "severity": "WARNING",
            "source": "",
        },
        {
            "name": "Payment Issues",
            "severity": "",
            "source": "payment_processor",
        },
        {
            "name": "Recent Errors",
            "severity": "ERROR",
            "source": "",
        },
    ]

    def __init__(self):
        self.created_users = []

    def clear_existing_data(self):
        """Clear all existing demo data."""
        print("🗑️  Clearing existing data...")

        # Clear in correct order to respect foreign key constraints
        UserFilterPreference.objects.all().delete()
        Log.objects.all().delete()

        # Only delete non-superuser accounts to preserve admin
        User.objects.filter(is_superuser=False).delete()

        print("✅ Existing data cleared")

    def create_users(self, count: int) -> List[User]:
        """Create demo users."""
        print(f"👥 Creating {count} demo users...")

        users = []
        for i in range(min(count, len(self.DEMO_USERS))):
            user_data = self.DEMO_USERS[i].copy()

            # Check if user already exists
            if User.objects.filter(username=user_data["username"]).exists():
                user = User.objects.get(username=user_data["username"])
                print(f"   ℹ️  User {user_data['username']} already exists")
            else:
                user = User.objects.create_user(
                    password="demo123",  # Default password for all demo users
                    **user_data,
                )
                print(f"   ✅ Created user: {user.username} ({user.email})")

            users.append(user)

        self.created_users = users
        return users

    def create_logs(self, count: int):
        """Create realistic log entries."""
        print(f"📝 Generating {count} log entries...")

        # Weight distribution for severities (more INFO/WARNING, fewer CRITICAL)
        severity_weights = {
            "DEBUG": 0.20,
            "INFO": 0.40,
            "WARNING": 0.25,
            "ERROR": 0.12,
            "CRITICAL": 0.03,
        }

        # Create weighted list of severities
        weighted_severities = []
        for severity, weight in severity_weights.items():
            weighted_severities.extend([severity] * int(weight * 100))

        logs_to_create = []
        now = timezone.now()

        for i in range(count):
            # Generate timestamp within last 30 days with realistic distribution
            # More recent logs are more likely
            days_ago = random.choices(
                range(30), weights=[max(30 - i, 1) for i in range(30)], k=1
            )[0]

            hours_ago = random.randint(0, 23)
            minutes_ago = random.randint(0, 59)
            seconds_ago = random.randint(0, 59)

            timestamp = now - timedelta(
                days=days_ago, hours=hours_ago, minutes=minutes_ago, seconds=seconds_ago
            )

            # Select severity with realistic distribution
            severity = random.choice(weighted_severities)

            # Select source
            source = random.choice(self.SOURCES)

            # Select message based on severity
            message = random.choice(self.LOG_MESSAGES[severity])

            # Add contextual details to some messages
            if random.random() < 0.3:  # 30% chance of additional context
                contexts = [
                    f"User ID: {random.randint(1, 1000)}",
                    f"Session: {random.randint(10000, 99999)}",
                    f"Request ID: {random.randint(100000, 999999)}",
                    f"Duration: {random.randint(50, 5000)}ms",
                    f"Memory: {random.randint(64, 512)}MB",
                    f"CPU: {random.randint(10, 95)}%",
                ]
                message += f" - {random.choice(contexts)}"

            log = Log(
                timestamp=timestamp,
                message=message,
                severity=severity,
                source=source,
            )
            logs_to_create.append(log)

            # Show progress every 100 logs
            if (i + 1) % 100 == 0:
                print(f"   📊 Generated {i + 1}/{count} logs...")

        # Bulk create for better performance
        Log.objects.bulk_create(logs_to_create, batch_size=100)
        print(f"✅ Created {count} log entries")

        # Show statistics
        self.show_log_statistics()

    def create_filter_preferences(self):
        """Create sample filter preferences for users."""
        if not self.created_users:
            print("⚠️  No users available for filter preferences")
            return

        print("🔍 Creating sample filter preferences...")

        for user in self.created_users:
            # Each user gets 2-4 random filter presets
            num_presets = random.randint(2, 4)
            user_presets = random.sample(self.FILTER_PRESETS, num_presets)

            for preset in user_presets:
                # Add some date ranges to some presets
                date_from = None
                date_to = None

                if random.random() < 0.4:  # 40% chance of date range
                    days_back = random.randint(1, 14)
                    date_from = (timezone.now() - timedelta(days=days_back)).date()

                if random.random() < 0.2:  # 20% chance of end date
                    date_to = timezone.now().date()

                try:
                    UserFilterPreference.objects.create(
                        user=user,
                        name=preset["name"],
                        severity=preset["severity"],
                        source=preset["source"],
                        date_from=date_from,
                        date_to=date_to,
                    )
                    print(
                        f"   ✅ Created filter '{preset['name']}' for {user.username}"
                    )
                except Exception as e:
                    print(
                        f"   ⚠️  Filter '{preset['name']}' already exists for {user.username}"
                    )

    def show_log_statistics(self):
        """Display statistics about generated logs."""
        print("\n📈 Log Statistics:")

        total_logs = Log.objects.count()
        print(f"   Total logs: {total_logs}")

        # Severity distribution
        for severity, _ in Log.SEVERITY_CHOICES:
            count = Log.objects.filter(severity=severity).count()
            percentage = (count / total_logs * 100) if total_logs > 0 else 0
            print(f"   {severity}: {count} ({percentage:.1f}%)")

        # Top sources
        print("\n📊 Top Sources:")
        from django.db.models import Count

        top_sources = (
            Log.objects.values("source")
            .annotate(count=Count("source"))
            .order_by("-count")[:5]
        )

        for source_data in top_sources:
            print(f"   {source_data['source']}: {source_data['count']} logs")

        # Date range
        if total_logs > 0:
            oldest = Log.objects.order_by("timestamp").first()
            newest = Log.objects.order_by("-timestamp").first()
            print(
                f"\n📅 Date range: {oldest.timestamp.date()} to {newest.timestamp.date()}"
            )

    def show_summary(self):
        """Show summary of generated data."""
        print("\n🎉 Demo Data Generation Complete!")
        print("=" * 50)

        user_count = User.objects.count()
        log_count = Log.objects.count()
        filter_count = UserFilterPreference.objects.count()

        print(f"👥 Users: {user_count}")
        print(f"📝 Logs: {log_count}")
        print(f"🔍 Filter Preferences: {filter_count}")

        print("\n🔑 Demo User Accounts:")
        for user_data in self.DEMO_USERS[: len(self.created_users)]:
            print(f"   Username: {user_data['username']}")
            print(f"   Email: {user_data['email']}")
            print(f"   Password: demo123")
            print()

        print("🚀 You can now:")
        print("   1. Start the Django server: python manage.py runserver")
        print("   2. Login with any demo account (password: demo123)")
        print("   3. Explore the logs dashboard with realistic data")
        print("   4. Test filtering, searching, and export features")


def main():
    """Main entry point for the demo data generator."""
    parser = argparse.ArgumentParser(
        description="Generate demo data for Logs Dashboard",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python generate_demo_data.py                    # Default: 500 logs, 3 users
  python generate_demo_data.py --logs 1000       # Generate 1000 logs
  python generate_demo_data.py --users 5         # Generate 5 users
  python generate_demo_data.py --clear           # Clear existing data first
        """,
    )

    parser.add_argument(
        "--logs",
        type=int,
        default=500,
        help="Number of log entries to generate (default: 500)",
    )

    parser.add_argument(
        "--users",
        type=int,
        default=3,
        help="Number of demo users to create (default: 3, max: 5)",
    )

    parser.add_argument(
        "--clear",
        action="store_true",
        help="Clear existing demo data before generating new data",
    )

    args = parser.parse_args()

    print("🚀 Logs Dashboard Demo Data Generator")
    print("=" * 40)

    # Validate arguments
    if args.logs < 1:
        print("❌ Error: Number of logs must be at least 1")
        sys.exit(1)

    if args.users < 1 or args.users > 5:
        print("❌ Error: Number of users must be between 1 and 5")
        sys.exit(1)

    try:
        generator = DemoDataGenerator()

        # Clear existing data if requested
        if args.clear:
            generator.clear_existing_data()

        # Generate data
        generator.create_users(args.users)
        generator.create_logs(args.logs)
        generator.create_filter_preferences()

        # Show summary
        generator.show_summary()

    except KeyboardInterrupt:
        print("\n\n⚠️ Generation cancelled by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Error during generation: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
