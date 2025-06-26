@Library('jenkins-shared-library@main') _

environment {
    REGISTRY_CRED = credentials('REGISTRY_URL')
    HOST_CRED = credentials('HOST_CLIENTPI')
    API_BASE_CRED = credentials('DIOCHAT_BASE_URL')
}

singleImageBuild(
    repo: 'https://github.com/petedillo/ollama-chat',
    registry: env.REGISTRY_CRED,
    host: env.HOST_CRED,
    sshCreds: 'jenkins-petedillo',
    composePath: '/home/pete/services/ollama/compose.yaml',
    imageName: 'ollama-frontend',
    branch: 'main',
    buildArgs: [VITE_API_BASE_URL: env.API_BASE_CRED],
    contextPath: '.',
    platform: 'linux/arm64',
    push: true
)