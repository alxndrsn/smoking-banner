.PHONY: build
build:
	./scripts/build

.PHONY: start
start: build
	./scripts/launch-chrome
