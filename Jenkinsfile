pipeline {
    agent any

    environment {
        DOCKER_REGISTRY = "my-docker-registry.com" // Replace with actual registry
        APP_NAME = "institutional-intelligence-platform"
        KUBECONFIG_CREDENTIAL_ID = "k8s-config"
        DOCKER_CREDENTIAL_ID = "docker-hub-credentials"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Lint & Type Check') {
            steps {
                sh 'npm run build' // Validates TS compilation across all services
            }
        }

        stage('Test') {
            steps {
                sh 'npm test' // Runs workspace tests
            }
        }

        stage('Build \u0026 Push Docker Images') {
            steps {
                script {
                    def services = ["identity-service", "student-service", "teacher-service", "webhook-service", "analytics-service", "ceo-api", "api-gateway"]
                    docker.withRegistry("https://${DOCKER_REGISTRY}", DOCKER_CREDENTIAL_ID) {
                        services.each { service ->
                            echo "Building and pushing ${service}..."
                            def image = docker.build("${DOCKER_REGISTRY}/${service}:${env.BUILD_NUMBER}", "--build-arg SERVICE_NAME=${service} .")
                            image.push()
                            image.push("latest")
                        }
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                withKubeConfig([credentialsId: KUBECONFIG_CREDENTIAL_ID]) {
                    echo "Deploying to Kubernetes namespace: institutional-platform"
                    sh "kubectl apply -f infrastructure/k8s/base-config.yaml"
                    sh "kubectl apply -f infrastructure/k8s/identity-service.yaml"
                    sh "kubectl apply -f infrastructure/k8s/business-services.yaml"
                    sh "kubectl apply -f infrastructure/k8s/event-services.yaml"
                    sh "kubectl apply -f infrastructure/k8s/ingress-services.yaml"
                    
                    // Force rollout restart to pick up new images if tags are 'latest'
                    // In production, we'd use the specific ${env.BUILD_NUMBER} tag in the YAMLs
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
            echo "Deployment successful!"
        }
        failure {
            echo "Deployment failed. Check logs."
        }
    }
}
