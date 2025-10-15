"""Custom password validators for simplified requirements"""

from django.core.exceptions import ValidationError


class MinimumLengthValidator:
    """
    Validate that the password is at least 4 characters long.
    Simplified from Django's default 8 character requirement.
    """

    def __init__(self, min_length=4):
        self.min_length = min_length

    def validate(self, password, user=None):  # pylint: disable=unused-argument
        if len(password) < self.min_length:
            raise ValidationError(
                f"This password is too short. It must contain at least {self.min_length} characters.",
                code="password_too_short",
            )

    def get_help_text(self):
        return f"Your password must contain at least {self.min_length} characters."
