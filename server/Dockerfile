FROM golang:latest

ENV GO111MODULE=on

ENV API_KEY key
ENV API_SECRET secret
ENV API_URL url
ENV DATA_DIR data/

RUN mkdir /app
ADD . /app
WORKDIR /app

RUN go build -o main .

CMD /app/main --http=:3002 --api-key $API_KEY --api-secret=$API_SECRET --api-url=$API_URL --data-directory=$DATA_DIR

EXPOSE 3002