@Library('jenkins-shared-library@main') _

singleImageBuild(
    repo: 'https://github.com/petedillo/ollama-chat',
    registry: 'diolab:5000',
    host: '192.168.0.43',
    sshCreds: 'jenkins-petedillo',
    composePath: '/home/pete/services/ollama/compose.yaml',
    imageName: 'ollama-chat',
    branch: 'main',
    buildArgs: [VITE_API_BASE_URL: 'http://192.168.0.18:3000'],
    contextPath: '.',
    platforms: 'linux/arm64',
    push: true  
)