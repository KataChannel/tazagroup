# Stage 1: Chạy SSR trên Node.js
FROM node:18-alpine AS runtime

WORKDIR /app

# Copy build có sẵn từ local vào Docker image
COPY ./dist/frontend /app/dist/frontend
# COPY ./node_modules /app/node_modules
# COPY ./package.json /app/package.json

# Chạy ứng dụng SSR
EXPOSE 4301
CMD ["node", "dist/frontend/server/server.mjs"]
