#!/bin/bash -x

# Output JSON file
output_json="output.json"

# Start the JSON array
echo "[" >"$output_json"

first_entry=true

# Loop through all .md files in the specified directory
# Changed to iterate through files in the 'prompts/' directory
for file in prompts/*; do # Assuming files have .md extension and are in 'prompts'
  if [ -f "$file" ]; then
    # Extract filename (without extension) as title
    title=$(basename "$file" .md)

    # Read the content of the file line by line into a temporary array
    temp_content_array=()
    while IFS= read -r line || [[ -n "$line" ]]; do
      temp_content_array+=("$line")
    done <"$file"

    # Join the array elements with newlines to form the prompt content
    prompt=$(printf "%s\n" "${temp_content_array[@]}")

    # Remove the trailing newline if it's not desired (printf adds one usually)
    prompt="${prompt%$'\n'}"

    # Escape double quotes, backslashes, and crucially, newlines for JSON
    prompt=$(echo "$prompt" | sed 's/\\/\\\\/g' | sed 's/"/\\"/g' | sed ':a;N;$!ba;s/\n/\\n/g')

    # Add a comma before the entry if it's not the first one
    if [ "$first_entry" = false ]; then
      echo "," >>"$output_json"
    fi

    # Append the JSON object for the current file to the output file
    cat <<EOF >>"$output_json"
    {
      "title": "$title",
      "category": "null",
      "prompt": "$prompt",
      "promptType": "user",
      "tags": "null"
    }
EOF
    first_entry=false
  fi
done

# End the JSON array
echo "]" >>"$output_json"

echo "JSON array created in $output_json"
