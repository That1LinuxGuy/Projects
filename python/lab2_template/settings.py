# PostgreSQL
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'mcallen',
        'USER': 'mcallen',
        'PASSWORD': 'SuperSecretPassword',
        'HOST': 'localhost',
        'PORT': '5432',
        'DEBUG': 'True',
    }
}

INSTALLED_APPS = (
    'crud',
)

ALLOWED_HOSTS = [
        "localhost",
        "127.0.0.1",
        "::1",
        ]

SECRET_KEY = 'zbN2YMwPI2dHUChd4Iv8Zlj9NFI9laro'
