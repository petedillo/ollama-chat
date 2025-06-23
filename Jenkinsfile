@Library('jenkins-shared-library@main')

pipeline {
    agent any
    
    environment {
        DOCKER_REGISTRY = credentials('REGISTRY_URL')
        DEPLOYMENT_HOST = credentials('HOST_CLIENTPI')
        VITE_API_BASE_URL = credentials('DIOCHAT_BASE_URL')
    }
    
    stages {
        stage('Build and Deploy') {
            steps {
                script {
                    withCredentials([
                        sshUserPrivateKey(
                            credentialsId: 'pi-ssh-key',
                            keyFileVariable: 'SSH_KEY',
                            usernameVariable: 'SSH_USER'
                        )
                    ]) {
                        Map pipelineConfig = [
                            repo: 'https://github.com/petedillo/ollama-chat',
                            registry: DOCKER_REGISTRY,
                            host: DEPLOYMENT_HOST,
                            sshCreds: [
                                host: DEPLOYMENT_HOST,
                                username: SSH_USER,
                                key: SSH_KEY
                            ],
                            composePath: '/services/ollama/compose.yaml',
                            imageName: 'ollama-chat',
                            branch: 'main',
                            contextPath: '.',
                            buildArgs: [
                                VITE_API_BASE_URL: VITE_API_BASE_URL
                            ]
                        ]
                        
                        singleImageBuild(pipelineConfig)
                    }
                }
            }
        }
    }
}