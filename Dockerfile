FROM alpine:3.20

WORKDIR /app
COPY README.md /app/README.md
RUN printf '%s\n' \
  '<!doctype html>' \
  '<html lang="en">' \
  '<head><meta charset="utf-8"><title>Custom Template</title></head>' \
  '<body><h1>Custom Template</h1><p>Replace this Dockerfile with your own app.</p></body>' \
  '</html>' \
  > /app/index.html
EXPOSE 8080
CMD ["busybox", "httpd", "-f", "-p", "8080", "-h", "/app"]
