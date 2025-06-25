@Library('jenkins-shared-library@main') _

def registry = env.REGISTRY ?: 'diolab:5000'
def host = env.HOST ?: '192.168.0.43'
def apiBaseUrl = env.VITE_API_BASE_URL ?: 'http://192.168.0.18:3000'

singleImageBuild(
    repo: 'https://github.com/petedillo/ollama-chat',
    registry: registry,
    host: host,
    sshCreds: 'jenkins',
    composePath: '/home/pete/services/ollama/compose.yaml',
    imageName: 'ollama-frontend',
    branch: 'main',
    buildArgs: [VITE_API_BASE_URL: apiBaseUrl],
    contextPath: '.',
    platform: 'linux/arm64',
    push: true
)