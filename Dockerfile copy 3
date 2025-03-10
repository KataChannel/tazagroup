# Stage 1: Build Angular SSR
FROM node:18-alpine AS build

WORKDIR /app

# Copy package.json và package-lock.json trước để tối ưu cache
COPY package.json package-lock.json ./

# Cài đặt toàn bộ dependencies (bao gồm devDependencies để build)
RUN npm ci --force

# Cài đặt Angular CLI toàn cục (nếu không có trong dependencies)
RUN npm install -g @angular/cli --force

# Copy toàn bộ mã nguồn
COPY . .

ENV NODE_OPTIONS="--max-old-space-size=2048"

# Build Angular với Universal (SSR)
RUN npm run build --prod

# Stage 2: Chạy SSR trên Node.js
FROM node:18-alpine AS runtime

WORKDIR /app

# Chỉ copy những file cần thiết từ build stage để giảm kích thước image
COPY --from=build /app/dist/frontend /app/dist/frontend
COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/package.json /app/package.json

# Chạy ứng dụng SSR
EXPOSE 4301
CMD ["node", "dist/frontend/server/server.mjs"]

