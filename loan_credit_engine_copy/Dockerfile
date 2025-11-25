# --- STAGE 1: BUILD ENVIRONMENT ---
# Use a slim Python image for the base build environment
FROM python:3.11-slim as build

# Set environment variables for non-interactive commands
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Install dependencies needed for some Python packages (like psycopg2)
# We use 'build-essential' for packages that require compilation
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        build-essential \
        # Add any other required system libraries here (e.g., libpq-dev, netcat) \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /app

# Copy dependency files
COPY requirements.txt .

# Install Python dependencies into a separate site-packages location
# We use --no-cache-dir to avoid storing build files
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

# --- STAGE 2: PRODUCTION ENVIRONMENT ---
# Use a clean, small Python image for the final production container.
# This stage only copies the compiled dependencies and code, not the large build tools.
FROM python:3.11-slim

# Set the same crucial environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set the working directory
WORKDIR /app

# Copy the application code
COPY main.py .

# Copy the installed dependencies from the build stage
COPY --from=build /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages

# Expose the port the application will run on
EXPOSE 8000

# Run the application using Gunicorn to manage Uvicorn workers.
# This ensures parallel processing and robustness in production.
# The number of workers is often set to (2 * CPU_CORES) + 1.
# Here we use a variable, which can be overridden at runtime.
# command structure: gunicorn [options] module:app
CMD ["gunicorn", "-k", "uvicorn.workers.UvicornWorker", "-c", "gunicorn.conf.py", "main:app"]

# NOTE: For better production configuration, you would typically use a gunicorn.conf.py
# or environment variables to set the number of workers dynamically.
# Since we didn't provide a gunicorn.conf.py, the above CMD line is slightly simplified.
# If you don't need Gunicorn (e.g., small single-worker dev), use:
# CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]