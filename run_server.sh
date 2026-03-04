#!/usr/bin/env bash

# Move to script directory (optional but useful)
cd "$(dirname "$0")"

echo "Starting Jekyll server with LiveReload..."
bundle exec jekyll serve --livereload
