FROM oven/bun:1 AS builder
WORKDIR /frontend
COPY package.json /frontend
RUN bun install 
COPY . .
RUN bun run build 


FROM nginx:latest
COPY --from=builder /frontend/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

