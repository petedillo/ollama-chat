@Library('jenkins-shared-library@main') _

properties([
    parameters([
        string(name: 'REGISTRY', description: 'Docker registry URL'),
        string(name: 'HOST', description: 'Deployment host'),
        string(name: 'API_BASE', description: 'API base URL')
    ])
])

node {
    stage('Run Shared Library') {
        script {
            singleImageBuild([
                repo: 'https://github.com/petedillo/ollama-chat',
                registry: params.REGISTRY,
                host: params.HOST,
                sshCreds: 'jenkins-petedillo',
                composePath: '/home/pete/services/ollama/compose.yaml',
                imageName: 'ollama-frontend',
                branch: 'main',
                buildArgs: [VITE_API_BASE_URL: params.API_BASE],
                contextPath: '.',
                platform: 'linux/arm64',
                push: true
            ])
        }
    }
}