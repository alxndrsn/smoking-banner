.PHONY: build
build:
	./scripts/build

.PHONY: start
start: build
	./scripts/launch-chrome

.PHONY: start-firefox
start-firefox: build
	yarn run web-ext run --source-dir ./build/
