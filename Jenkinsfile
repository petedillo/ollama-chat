pipeline {
    agent any

    environment {
        REGISTRY_URL = credentials('REGISTRY_URL')
        IMAGE_NAME = "${REGISTRY_URL}/ollama-chat"
        PATH = "/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/bin/docker"
        DOCKER_HOST = "unix:///var/run/docker.sock"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Check Docker') {
            steps {
                sh 'docker --version'
            }
        }

        stage('Build and Push') {
            steps {
                sh 'docker build -t $IMAGE_NAME:$BUILD_ID .'
                sh 'docker tag $IMAGE_NAME:$BUILD_ID $IMAGE_NAME:latest'
                sh 'docker push $IMAGE_NAME:$BUILD_ID'
                sh 'docker push $IMAGE_NAME:latest'
            }
        }

        stage('Clean Up') {
            steps {
                sh 'docker rmi -f $IMAGE_NAME:$BUILD_ID || true'
                sh 'docker rmi -f $IMAGE_NAME:latest || true'
            }
        }
    }
}