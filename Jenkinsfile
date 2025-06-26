@Library('jenkins-shared-library@main') _

def registry = env.REGISTRY 
def host = env.HOST 
def apiBaseUrl = env.DIOCHAT_BASE_URL 

singleImageBuild(
    repo: 'https://github.com/petedillo/ollama-chat',
    registry: registry,
    host: host,
    sshCreds: 'jenkins-petedillo',
    composePath: '/home/pete/services/ollama/compose.yaml',
    imageName: 'ollama-frontend',
    branch: 'main',
    buildArgs: [VITE_API_BASE_URL: apiBaseUrl],
    contextPath: '.',
    platform: 'linux/arm64',
    push: true
)