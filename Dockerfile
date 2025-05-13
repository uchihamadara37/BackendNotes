# Install dependencies and build
FROM node:18-alpine AS builder
WORKDIR /app
COPY . .

# === Define ARGs ===
ARG ADMIN_PROJECT_ID
ARG ADMIN_PRIVATE_KEY
ARG ADMIN_CLIENT_EMAIL

ENV ADMIN_PROJECT_ID=$ADMIN_PROJECT_ID 
ENV ADMIN_PRIVATE_KEY=$ADMIN_PRIVATE_KEY 
ENV ADMIN_CLIENT_EMAIL=$ADMIN_CLIENT_EMAIL 

RUN npm ci
RUN npm run build

# Serve with next start
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app ./
EXPOSE 8080
ENV PORT 8080
CMD ["npm", "start"]