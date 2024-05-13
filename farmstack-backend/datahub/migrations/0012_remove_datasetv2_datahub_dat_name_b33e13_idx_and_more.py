# Generated by Django 4.0.5 on 2023-01-09 19:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('datahub', '0011_alter_datasetv2file_file'),
    ]

    operations = [
        migrations.RemoveIndex(
            model_name='datasetv2',
            name='datahub_dat_name_b33e13_idx',
        ),
        migrations.AddIndex(
            model_name='datasetv2',
            index=models.Index(fields=['name', 'category'], name='datahub_dat_name_ca10db_idx'),
        ),
    ]