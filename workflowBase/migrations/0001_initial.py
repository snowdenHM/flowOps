# Generated by Django 4.1.7 on 2023-03-30 10:47

from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='State',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False, unique=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('name', models.CharField(max_length=255)),
                ('stateType', models.CharField(choices=[('Initial', 'Initial'), ('End', 'End'), ('Flow', 'Flow')], default='Flow', max_length=20)),
            ],
            options={
                'verbose_name': 'State',
                'verbose_name_plural': 'States',
            },
        ),
        migrations.CreateModel(
            name='TransitionEvents',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False, unique=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('name', models.CharField(choices=[('Mail', 'Mail'), ('SMS', 'SMS')], max_length=20)),
            ],
            options={
                'verbose_name': 'Transition Event',
                'verbose_name_plural': 'Transition Events',
            },
        ),
        migrations.CreateModel(
            name='Workflow',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False, unique=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('name', models.CharField(max_length=255)),
            ],
            options={
                'verbose_name': 'Workflow',
                'verbose_name_plural': 'Workflows',
            },
        ),
        migrations.CreateModel(
            name='Transition',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False, unique=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('description', models.CharField(default='', max_length=255)),
                ('endState', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='transitionEndState', to='workflowBase.state')),
                ('selectWorkflow', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='workflowTransition', to='workflowBase.workflow')),
                ('startState', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='transitionStartState', to='workflowBase.state')),
            ],
            options={
                'verbose_name': 'Transition',
                'verbose_name_plural': 'Transitions',
            },
        ),
        migrations.AddField(
            model_name='state',
            name='selectWorkflow',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='workflowState', to='workflowBase.workflow'),
        ),
    ]
