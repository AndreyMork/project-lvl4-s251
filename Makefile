start:
	DEBUG="task-manager:*" npm run nodemon -- --watch '.' --ext '.js' --exec npm run babel-node task-manager.js

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
	npm run test

watch-test:
	npm run watch-test
