DC := docker-compose
DCX := ${DC} exec

clear:
	${DC} stop db
	${DC} rm -f db
	docker volume rm hom_data
	${DC} up -d

up:
	${DC} up -d
	${DC} ps

bash:
	${DCX} app bash

init:
	mkdir -p static
	${DCX} app django-admin migrate
	${DCX} app django-admin collectstatic --noinput
	${DCX} app django-admin loaddata fixtures.yaml
	npm install

dump:
	${DCX} app django-admin dumpdata --format=yaml > fixtures.yaml \
		-e admin -e contenttypes -e sessions -e authtoken

static:
	mkdir -p static
	${DCX} app django-admin collectstatic

update:
	${DCX} app django-admin makemigrations
	${DCX} app django-admin migrate

rm:
	${DC} stop
	${DC} rm -fv
	rm -rf static/

rolling:
	git pull origin master
	${DC} up -d --build
