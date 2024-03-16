# Generated by Django 4.2.7 on 2024-03-08 00:11

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('firstname', models.CharField(max_length=250)),
                ('lastname', models.CharField(max_length=250)),
                ('email', models.CharField(max_length=250, unique=True)),
                ('password', models.CharField(max_length=250)),
                ('session_id', models.CharField(max_length=250, null=True)),
                ('reset_token', models.CharField(max_length=250, null=True)),
            ],
        ),
    ]