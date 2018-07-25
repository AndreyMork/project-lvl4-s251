start:
	DEBUG="task-manager:*" npm run nodemon -- --watch '.' --ext '.js' --exec npm run gulp -- server

new-table:
	psql -d task_manager < sql/createtable.sql

gulp-console:
	npm run gulp console

install:
	npm install

build:
	rm -rf dist
	npm run build

publish:
	npm publish

lint:
	npm run eslint .

test:
	npm test

watch-test:
	npm test -- --watch --notify

coverage-test:
	npm test -- --coverage
