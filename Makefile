start:
	DEBUG="task-manager:*" npx nodemon --watch '.' --ext '.js' --exec npx gulp server

gulp-console:
	npx gulp console

install:
	npm install

build:
	rm -rf dist
	npm run build

lint:
	npx eslint .

test:
	npm test

watch-test:
	npm test -- --watch --notify

coverage-test:
	npm test -- --coverage
