# Generated by Django 4.0.5 on 2022-09-19 11:06

import accounts.models
from django.db import migrations, models
import django.db.models.deletion
import utils.validators
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='UserRole',
            fields=[
                ('id', models.IntegerField(primary_key=True, serialize=False)),
                ('role_name', models.CharField(choices=[('datahub_admin', 'datahub_admin'), ('datahub_team_member', 'datahub_team_member'), ('datahub_participant_root', 'datahub_participant_root'), ('datahub_participant_team', 'datahub_participant_team'), ('datahub_guest_user', 'datahub_guest_user')], max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='User',
            fields=[
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('email', models.EmailField(max_length=255, unique=True)),
                ('first_name', models.CharField(blank=True, max_length=255, null=True)),
                ('last_name', models.CharField(blank=True, max_length=255, null=True)),
                ('phone_number', models.CharField(blank=True, max_length=50, null=True)),
                ('profile_picture', models.ImageField(blank=True, null=True, upload_to='users/profile_pictures/', validators=[utils.validators.validate_file_size])),
                ('status', models.BooleanField(default=True)),
                ('on_boarded', models.BooleanField(default=False)),
                ('subscription', models.CharField(blank=True, max_length=50, null=True)),
                ('role', models.ForeignKey(max_length=255, on_delete=django.db.models.deletion.PROTECT, to='accounts.userrole')),
            ],
            options={
                'abstract': False,
            },
            managers=[
                ('objects', accounts.models.UserManager()),
            ],
        ),
    ]