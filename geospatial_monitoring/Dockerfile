# Dockerfile

# Use the official Python 3.9 image as the base image
FROM python:3.9.8

RUN apt-get update && apt-get install -y libc-dev
# Set the working directory in the container
WORKDIR /app

# Copy the requirements.txt file to the container
COPY requirements.txt .

# Install project dependencies
RUN pip install -r requirements.txt

# Copy the project files to the container
COPY . .

# Set environment variables
ENV PYTHONUNBUFFERED=1

# Expose the port on which the Django server will run (change if necessary)
EXPOSE 8000

# Run the Django development server
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]