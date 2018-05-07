start:
	DEBUG="task-manager:*" npm run nodemon -- --watch '.' --ext '.js' --exec npm run babel-node index.js

server:
	nodemon --exec babel-node src/index.js

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

test-coverage:
	npm run test-coverage

watch-test:
	npm run watch-test
