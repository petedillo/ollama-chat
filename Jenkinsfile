@Library('jenkins-shared-library@main') _

singleImageBuild(
    repo: 'https://github.com/petedillo/ollama-chat',
    registry: 'diolab:5000',
    host: 'clientpi',
    sshCreds: 'pi-ssh-key',
    composePath: '/services/ollama/compose.yaml',
    imageName: 'ollama-chat',
    branch: 'main',
    buildArgs: [VITE_API_BASE_URL: 'http://localhost:3000'],
    contextPath: '.'
)