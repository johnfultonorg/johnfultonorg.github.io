.PHONY: help check-links push clean

help:
	@echo "Available commands:"
	@echo "  make check-links  - Check all external links"
	@echo "  make push         - Push changes to git"
	@echo "  make clean        - Clean temp files"

check-links:
	@sh check_links_simple.sh

push:
	@sh git_push.sh

clean:
	@rm -f *.tmp *.data
	@echo "Cleaned temp files"
