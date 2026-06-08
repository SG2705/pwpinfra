#!/bin/bash
# Cache Busting Utility
# Updates all ?v=x.x.x patterns across HTML and JS files to the specified version.
#
# Usage:
#   ./cache-bust.sh 1.0.0        # Sets all versions to ?v=1.0.0
#   ./cache-bust.sh              # Auto-increments patch version (e.g., 0.0.1 → 0.0.2)

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Detect current version from any HTML file
CURRENT_VERSION=$(grep -ohP '\?v=\K[0-9]+\.[0-9]+\.[0-9]+' "$SCRIPT_DIR/index.html" 2>/dev/null | head -1)

if [ -z "$CURRENT_VERSION" ]; then
  CURRENT_VERSION="0.0.1"
fi

if [ -n "$1" ]; then
  # Use provided version
  NEW_VERSION="$1"
else
  # Auto-increment patch
  MAJOR=$(echo "$CURRENT_VERSION" | cut -d. -f1)
  MINOR=$(echo "$CURRENT_VERSION" | cut -d. -f2)
  PATCH=$(echo "$CURRENT_VERSION" | cut -d. -f3)
  PATCH=$((PATCH + 1))
  NEW_VERSION="${MAJOR}.${MINOR}.${PATCH}"
fi

echo "Cache bust: v${CURRENT_VERSION} → v${NEW_VERSION}"
echo ""

# Find and replace in all HTML and JS files
FILE_COUNT=0

find "$SCRIPT_DIR" \
  -type f \( -name "*.html" -o -name "*.js" \) \
  ! -path "*/.git/*" \
  ! -path "*/node_modules/*" \
  | while read -r file; do
    if grep -q "?v=${CURRENT_VERSION}" "$file" 2>/dev/null; then
      sed -i '' "s/?v=${CURRENT_VERSION}/?v=${NEW_VERSION}/g" "$file"
      echo "  ✓ $(basename "$file")"
    fi
  done

echo ""
echo "Done. All references updated to ?v=${NEW_VERSION}"
