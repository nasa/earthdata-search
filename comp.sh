#!/bin/bash

# --- Configuration ---
# You can change the default output file name here if you like
DEFAULT_OUTPUT_FILE="found_strings_concatenated.txt"
SEPARATOR_LINE="================================================================================"
EXCLUDE_DIR_NAME="dist" # Folder name to exclude

# --- Helper Function for Usage ---
usage() {
  echo "Usage: $0 <search_string> [output_file]"
  echo "  search_string: The string to search for (case-insensitive)."
  echo "  output_file:   (Optional) The name of the file to store the results."
  echo "                 Defaults to '$DEFAULT_OUTPUT_FILE'."
  echo "  Will ignore any directories named '$EXCLUDE_DIR_NAME'."
  echo "Example: $0 \"myFunction\" results.txt"
  exit 1
}

# --- Argument Parsing ---
if [ -z "$1" ]; then
  echo "Error: Search string not provided."
  usage
fi

SEARCH_STRING="$1"
OUTPUT_FILE="${2:-$DEFAULT_OUTPUT_FILE}" # Use provided output file or default

# --- Main Logic ---

# Check if output file exists and inform user, then clear/create it
if [ -f "$OUTPUT_FILE" ]; then
  echo "Info: Output file '$OUTPUT_FILE' exists and will be overwritten."
fi
echo "Searching for '$SEARCH_STRING' in .js and .jsx files..."
echo "Ignoring directories named '$EXCLUDE_DIR_NAME'."
echo "Output will be written to '$OUTPUT_FILE'"
> "$OUTPUT_FILE" # Create or truncate the output file

# Use find to locate files, then grep to check for the string, then process matches
# -print0 and xargs -0 handle filenames with spaces, newlines, etc.
# grep -l outputs only filenames that match
# The while loop processes each matching file

found_count=0

# Explanation of the find command:
# .                                  # Start in the current directory
# \( -name "$EXCLUDE_DIR_NAME" -type d \) # Match directories named EXCLUDE_DIR_NAME
# -prune                             # If matched, do not descend into this directory
# -o                                 # OR (if not pruned)
# \( -type f \( -iname "*.js" -o -iname "*.jsx" \) -print0 \) # Find .js or .jsx files and print them null-terminated
find . \( -name "$EXCLUDE_DIR_NAME" -type d \) -prune \
  -o \
  \( -type f \( -iname "*.js" -o -iname "*.test.js" \) -print0 \) | \
  xargs -0 grep -li "$SEARCH_STRING" | \
  while IFS= read -r filepath; do
    # Make the path relative to the current directory, removing leading ./ if present
    relative_path="${filepath#./}"

    echo "Found in: $relative_path. Appending to $OUTPUT_FILE..."

    # Append the relative path header to the output file
    echo "$SEPARATOR_LINE" >> "$OUTPUT_FILE"
    echo "File: $relative_path" >> "$OUTPUT_FILE"
    echo "$SEPARATOR_LINE" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE" # Add a blank line for readability

    # Append the content of the found file to the output file
    cat "$filepath" >> "$OUTPUT_FILE"

    # Add a newline at the end of the concatenated file content if not already there
    # (optional, but good for readability if files don't end with newlines)
    if [ "$(tail -c1 "$filepath" | wc -l)" -eq 0 ]; then
        echo "" >> "$OUTPUT_FILE"
    fi
    echo "" >> "$OUTPUT_FILE" # Extra blank line after file content

    found_count=$((found_count + 1))
  done

# --- Final Output ---
if [ "$found_count" -eq 0 ]; then
  echo "No files found containing '$SEARCH_STRING' with .js or .jsx extension (outside '$EXCLUDE_DIR_NAME' folders)."
  # Optionally remove the empty output file
  # rm "$OUTPUT_FILE"
else
  echo "Done. Processed $found_count file(s)."
  echo "Results are in '$OUTPUT_FILE'."
fi

exit 0