pipeline {
    agent any
    environment {
        DOCKER_REGISTRY = 'ghcr.io/karthikpranavsivaraj'
    }
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('Node Pipeline') {
            agent {
                docker {
                    image 'node:20-alpine'
                    args '-u 0:0 -v /var/run/docker.sock:/var/run/docker.sock'
                    reuseNode true
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
        stage('Build & Push Docker Images') {
            agent {
                docker {
                    image 'docker:latest'
                    args '-v /var/run/docker.sock:/var/run/docker.sock'
                    reuseNode true
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
                    docker.withRegistry("https://ghcr.io", 'docker-registry-creds') {
                        services.each { svc ->
                            echo "Building ${svc}"
                            def img = docker.build(
                                "${env.DOCKER_REGISTRY}/${svc}:latest",
                                "-f services/${svc}/Dockerfile services/${svc}"
                            )
                            img.push('latest')
                        }
                    }
                }
            }
        }
        stage('Deploy to Kubernetes') {
            steps {
                script {
                    withCredentials([file(credentialsId: 'kubeconfig-creds', variable: 'KUBECONFIG_FILE')]) {
                        sh """
                            export KUBECONFIG=\$KUBECONFIG_FILE
                            kubectl apply -f infrastructure/k8s/base-config.yaml
                            kubectl apply -f infrastructure/k8s/identity-service.yaml
                            kubectl apply -f infrastructure/k8s/business-services.yaml
                            kubectl apply -f infrastructure/k8s/event-services.yaml
                            kubectl apply -f infrastructure/k8s/ingress-services.yaml
                            kubectl rollout restart deployment -n institutional-platform
                        """
                    }
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
