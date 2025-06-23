@Library('jenkins-shared-library@main') _

singleImageBuild(
    repo: 'https://github.com/petedillo/ollama-chat',
    registry: env.DOCKER_REGISTRY,
    host: env.DEPLOYMENT_HOST,
    sshCreds: 'pi-ssh-key',
    composePath: '/services/ollama/compose.yaml',
    imageName: 'ollama-chat',
    branch: 'main',
    buildArgs: [VITE_API_BASE_URL: env.VITE_API_BASE_URL],
    contextPath: '.'
)
