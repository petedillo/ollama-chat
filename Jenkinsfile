@Library('jenkins-shared-library@main') _

properties([
    parameters([
        string(name: 'REGISTRY', defaultValue: '', description: 'Docker registry'),
        string(name: 'HOST', defaultValue: '', description: 'Remote host'),
        string(name: 'DIOCHAT_BASE_URL', defaultValue: '', description: 'Base URL for the API')
    ])
])

singleImageBuild(
    repo: 'https://github.com/petedillo/ollama-chat',
    registry: params.REGISTRY,
    host: params.HOST,
    sshCreds: 'jenkins-petedillo',
    composePath: '/home/pete/services/ollama/compose.yaml',
    imageName: 'ollama-frontend',
    branch: 'main',
    buildArgs: [VITE_API_BASE_URL: params.DIOCHAT_BASE_URL],
    contextPath: '.',
    platform: 'linux/arm64',
    push: true
)