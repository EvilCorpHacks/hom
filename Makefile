DC := docker-compose
DCX := ${DC} exec

up:
	${DC} up -d
	${DC} ps

bash:
	${DCX} app bash

init:
	${DCX} app django-admin migrate
	${DCX} app django-admin createsuperuser
	${DCX} app django-admin collectstatic

update:
	${DCX} app django-admin makemigrations
	${DCX} app django-admin migrate

rm:
	${DC} stop
	${DC} rm -afv
	rm -rf static/
