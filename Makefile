.PHONY: help build check-links push clean

help:
	@echo "Available commands:"
	@echo "  make build        - Build site from src/ to root"
	@echo "  make check-links  - Check all external links"
	@echo "  make push         - Build, check links, and push to git"
	@echo "  make clean        - Clean temp files"

build:
	@sh build.sh

check-links:
	@sh check_links_simple.sh

push: build
	@sh git_push.sh

clean:
	@rm -f *.tmp *.data
	@echo "Cleaned temp files"
