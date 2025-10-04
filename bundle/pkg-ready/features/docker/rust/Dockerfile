# Rust Production Dockerfile
# Created by Package Installer CLI

# Build stage
FROM rust:1.75-alpine AS builder

# Install build dependencies
RUN apk add --no-cache \
    musl-dev \
    pkgconfig \
    openssl-dev \
    openssl-libs-static

WORKDIR /app

# Copy Cargo files
COPY Cargo.toml Cargo.lock ./

# Create a dummy main.rs to cache dependencies
RUN mkdir src && echo "fn main() {}" > src/main.rs

# Build dependencies (this will be cached)
RUN cargo build --release
RUN rm src/main.rs

# Copy source code
COPY src ./src

# Build the actual application
RUN touch src/main.rs && cargo build --release

# Runtime stage
FROM alpine:latest AS runtime

# Install runtime dependencies
RUN apk add --no-cache \
    ca-certificates \
    libgcc

# Create non-root user
RUN addgroup -g 1001 -S appuser
RUN adduser -S appuser -u 1001

# Copy the binary from builder stage
COPY --from=builder /app/target/release/app /usr/local/bin/app

# Change ownership
RUN chown appuser:appuser /usr/local/bin/app

# Switch to non-root user
USER appuser

# Expose port (adjust as needed)
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8000/health || exit 1

# Set environment variables
ENV RUST_LOG=info
ENV PORT=8000

# Start the application
CMD ["app"]
