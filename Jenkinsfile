@Library('jenkins-shared-library@main') _

// Pipeline configuration
Map pipelineConfig = [
    repo: 'https://github.com/petedillo/ollama-chat',
    registry: env.DOCKER_REGISTRY,
    host: env.DEPLOYMENT_HOST,
    sshCreds: env.SSH_CREDS,
    composePath: '/services/ollama/compose.yaml',
    imageName: 'ollama-chat',
    branch: 'main',
    contextPath: '.',
    buildArgs: [
        VITE_API_BASE_URL: env.VITE_API_BASE_URL
    ]
]

// Call the shared library pipeline
singleImageBuildPipeline(pipelineConfig)
