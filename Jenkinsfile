@Library('jenkins-shared-library@main') _

pipeline {
    agent any
    
    environment {
        DOCKER_REGISTRY = credentials('REGISTRY_URL')
        DEPLOYMENT_HOST = credentials('HOST_CLIENTPI')
        VITE_API_BASE_URL = credentials('DIOCHAT_BASE_URL')
    }
    
    options {
        timeout(time: 30, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '10'))
        disableConcurrentBuilds()
    }
    
    stages {
        stage('Setup Environment') {
            steps {
                script {
                    env.COMMIT_HASH = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
                    env.FULL_IMAGE_NAME = "${env.DOCKER_REGISTRY}/ollama-chat"
                }
            }
        }
        
        stage('Validate Config') {
            steps {
                script {
                    // Validate we have all required environment variables
                    def requiredEnvVars = ['DOCKER_REGISTRY', 'DEPLOYMENT_HOST', 'VITE_API_BASE_URL']
                    def missingVars = requiredEnvVars.findAll { !env."$it" }
                    if (missingVars) {
                        error "Missing required environment variables: ${missingVars.join(', ')}"
                    }
                }
            }
        }
        
        stage('Checkout Code') {
            steps {
                checkout scm: [
                    $class: 'GitSCM',
                    branches: [[name: 'main']],
                    extensions: [[$class: 'CleanCheckout']],
                    userRemoteConfigs: [[url: 'https://github.com/petedillo/ollama-chat']]
                ]
            }
        }
        
        stage('Build Image') {
            steps {
                script {
                    withCredentials([
                        sshUserPrivateKey(
                            credentialsId: 'pi-ssh-key',
                            keyFileVariable: 'SSH_KEY',
                            usernameVariable: 'SSH_USER'
                        )
                    ]) {
                        dockerUtils.buildImage(this, [
                            imageName: FULL_IMAGE_NAME,
                            tag: env.COMMIT_HASH,
                            context: '.',
                            buildArgs: [
                                VITE_API_BASE_URL: VITE_API_BASE_URL
                            ]
                        ])
                    }
                }
            }
        }
        
        stage('Push Image') {
            steps {
                script {
                    dockerUtils.pushImage(this, "${FULL_IMAGE_NAME}:${env.COMMIT_HASH}")
                    dockerUtils.pushImage(this, "${FULL_IMAGE_NAME}:latest")
                }
            }
        }
        
        stage('Deploy') {
            steps {
                script {
                    withCredentials([
                        sshUserPrivateKey(
                            credentialsId: 'pi-ssh-key',
                            keyFileVariable: 'SSH_KEY',
                            usernameVariable: 'SSH_USER'
                        )
                    ]) {
                        sshUtils.deploy(this, [
                            host: DEPLOYMENT_HOST,
                            credsId: [
                                host: DEPLOYMENT_HOST,
                                username: SSH_USER,
                                key: SSH_KEY
                            ],
                            composePath: '/services/ollama/compose.yaml',
                            image: "${FULL_IMAGE_NAME}:latest"
                        ])
                    }
                }
            }
        }
    }
    
    post {
        always {
            script {
                // Clean up Docker images
                dockerUtils.cleanup(this, "${FULL_IMAGE_NAME}:${env.COMMIT_HASH}")
                dockerUtils.cleanup(this, "${FULL_IMAGE_NAME}:latest")
            }
        }
        
        success {
            script {
                echo "Build succeeded: ${env.JOB_NAME} #${env.BUILD_NUMBER}"
            }
        }
        
        failure {
            script {
                echo "Build failed: ${env.JOB_NAME} #${env.BUILD_NUMBER}"
            }
        }
        
        unstable {
            script {
                echo "Build unstable: ${env.JOB_NAME} #${env.BUILD_NUMBER}"
            }
        }
    }
}
