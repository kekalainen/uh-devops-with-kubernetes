#!/bin/sh

echo 'Requesting a random article'
export URL="$(curl https://en.wikipedia.org/wiki/Special:Random -si | grep location | sed -e 's/location: //g' | sed -e 's/\r//g')"

echo 'Creating a todo with the URL' $URL
curl "$BACKEND_URL" -X POST -H 'Content-Type: application/json' --data-raw "{\"query\": \"mutation { createTodo(content: \\\"Read $URL\\\" ) { content } }\" }" --compressed
