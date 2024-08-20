# Use an official Python runtime as a parent image
FROM python:3.7-slim

# Install system dependencies and ODBC driver
RUN apt-get update && apt-get install -y \
    build-essential \
    cmake \
    g++ \
    libboost-python-dev \
    libboost-thread-dev \
    libopencv-dev \
    libopenblas-dev \
    liblapack-dev \
    libx11-dev \
    libgtk-3-dev \
    gnupg2 \
    curl \
    unixodbc-dev \
    && curl https://packages.microsoft.com/keys/microsoft.asc | apt-key add - \
    && curl https://packages.microsoft.com/config/debian/10/prod.list > /etc/apt/sources.list.d/mssql-release.list \
    && apt-get update \
    && ACCEPT_EULA=Y apt-get install -y msodbcsql17 \
    && apt-get clean

# Set the timezone to IST
ENV TZ=Asia/Kolkata

# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install dlib
RUN pip install --no-cache-dir dlib

# Install any other needed packages specified in requirements.txt
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

# Make port 80 available to the world outside this container
EXPOSE 8000

# Run the FastAPI app with Uvicorn server
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

# docker build -t my-fastapi-app .
# docker run -p 8080:80 my-fastapi-app
# docker tag my-fastapi-app rohitwonderbiz/my-fastapi-app
# docker push your-dockerhub-username/your-app-name