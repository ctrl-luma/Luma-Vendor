# Serve static Next.js export from /out
FROM joseluisq/static-web-server:2-alpine

ENV SERVER_ROOT="/www"
WORKDIR /www

# Next.js `next build` will create `out/` in the repo
COPY out .

EXPOSE 80
