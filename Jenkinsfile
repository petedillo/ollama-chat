@Library('jenkins-shared-library@main') _

singleImageBuild(
    repo: 'https://github.com/petedillo/ollama-chat',
    registry: 'diolab:5000',
    host: 'clientpi',
    sshCreds: 'jenkins-petedillo',
    composePath: '/home/pete/services/ollama/compose.yaml',
    imageName: 'ollama-frontend',
    branch: 'main',
    buildArgs: [VITE_API_BASE_URL: 'https://api.diochat.petedillo.com'],
    contextPath: '.',
    platform: 'linux/arm64',
    push: true
)

