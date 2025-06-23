@Library('jenkins-shared-library@main') _

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
                            registry: env.DOCKER_REGISTRY,
                            host: env.DEPLOYMENT_HOST,
                            sshCreds: [
                                host: env.DEPLOYMENT_HOST,
                                username: env.SSH_USER,
                                key: env.SSH_KEY
                            ],
                            composePath: '/services/ollama/compose.yaml',
                            imageName: 'ollama-chat',
                            branch: 'main',
                            contextPath: '.',
                            buildArgs: [
                                VITE_API_BASE_URL: env.VITE_API_BASE_URL
                            ]
                        ]
                        
                        singleImageBuild(pipelineConfig)
                    }
                }
            }
        }
    }
}
