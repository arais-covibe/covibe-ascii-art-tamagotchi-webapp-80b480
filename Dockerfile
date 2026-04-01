FROM alpine:3.20

WORKDIR /app
COPY index.html /app/index.html
EXPOSE 8080
CMD ["busybox", "httpd", "-f", "-p", "8080", "-h", "/app"]
