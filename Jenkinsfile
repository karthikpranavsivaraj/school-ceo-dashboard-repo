pipeline {
    agent any
    environment {
        DOCKER_REGISTRY          = 'ghcr.io/karthikpranavsivaraj'
        DOCKER_CREDENTIAL_ID     = 'docker-registry-creds'
        KUBECONFIG_CREDENTIAL_ID = 'kubeconfig-creds'
    }
    stages {
        // -------------------------
        // Checkout
        // -------------------------
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        // -------------------------
        // Node Pipeline
        // -------------------------
        stage('Node Pipeline') {
            agent {
                docker {
                    image 'node:20-alpine'
                    args '-u 0:0 -v /var/run/docker.sock:/var/run/docker.sock'
                }
            }
            stages {
                stage('Install') {
                    steps {
                        sh 'npm ci'
                    }
                }
                stage('Build') {
                    steps {
                        sh 'npm run build'
                    }
                }
                stage('Test') {
                    steps {
                        sh 'npm test || true'
                    }
                }
            }
        }
        // -------------------------
        // Build & Push Docker
        // -------------------------
        stage('Build & Push Docker Images') {
            agent {
                docker {
                    image 'docker:latest'
                    args '-v /var/run/docker.sock:/var/run/docker.sock'
                }
            }
            steps {
                script {
                    def services = [
                        "identity-service",
                        "student-service",
                        "teacher-service",
                        "webhook-service",
                        "analytics-service",
                        "ceo-api",
                        "api-gateway"
                    ]
                    docker.withRegistry("https://${env.DOCKER_REGISTRY}", 'docker-registry-creds') {
                        services.each { service ->
                            echo "Building ${service}"
                            def image = docker.build(
                                "${env.DOCKER_REGISTRY}/${service}:latest",
                                "--build-arg SERVICE_NAME=${service} ."
                            )
                            image.push('latest')
                        }
                    }
                }
            }
        }
        // -------------------------
        // Deploy to Kubernetes
        // -------------------------
        stage('Deploy to Kubernetes') {
            steps {
                withKubeConfig([credentialsId: 'kubeconfig-creds']) {
                    sh "kubectl apply -f infrastructure/k8s/base-config.yaml"
                    sh "kubectl apply -f infrastructure/k8s/identity-service.yaml"
                    sh "kubectl apply -f infrastructure/k8s/business-services.yaml"
                    sh "kubectl apply -f infrastructure/k8s/event-services.yaml"
                    sh "kubectl apply -f infrastructure/k8s/ingress-services.yaml"
                    sh "kubectl rollout restart deployment -n institutional-platform"
                }
            }
        }
    }
    post {
        always {
            cleanWs()
        }
        success {
            echo "Deployment successful"
        }
        failure {
            echo "Deployment failed - check logs"
        }
    }
}
