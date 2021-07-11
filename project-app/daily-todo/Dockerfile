FROM alpine:3.14

RUN apk add --no-cache curl sed

COPY job.sh .
RUN chmod +x ./job.sh

USER 1000
CMD ./job.sh
