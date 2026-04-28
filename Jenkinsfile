pipeline {
    agent any                                 // Master runs checkout & post‑actions
    environment {
        // 👉 Replace these placeholders with the actual values you have in Jenkins
        DOCKER_REGISTRY          = 'ghcr.io/karthikpranavsivaraj'   // e.g. ghcr.io/your‑user
        DOCKER_CREDENTIAL_ID     = 'docker‑registry‑creds'               // Jenkins cred ID for Docker login
        KUBECONFIG_CREDENTIAL_ID = 'kubeconfig‑creds'                    // Jenkins cred ID for kubeconfig
    }

    stages {

        // -------------------------------------------------
        // 1️⃣ Checkout
        // -------------------------------------------------
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        // -------------------------------------------------
        // 2️⃣ Install Dependencies (Node container)
        // -------------------------------------------------
        stage('Install Dependencies') {
            agent {
                docker {
                    image 'node:20-alpine'                // npm is pre‑installed here
                    // Run as root so the workspace permissions work
                    args '-u 0:0 -v /var/run/docker.sock:/var/run/docker.sock'
                }
            }
            steps {
                // Clean install using lock‑file – deterministic builds
                sh 'npm ci'
            }
        }

        // -------------------------------------------------
        // 3️⃣ Lint & Type Check (still in Node container)
        // -------------------------------------------------
        stage('Lint & Type Check') {
            steps {
                // Adjust these script names if you use different npm scripts
                sh 'npm run lint'        // optional – you may have only type‑check
                sh 'npm run build'       // runs `tsc` → creates ./dist
            }
        }

        // -------------------------------------------------
        // 4️⃣ Test (still in Node container)
        // -------------------------------------------------
        stage('Test') {
            steps {
                sh 'npm test'            // make sure your test script exits 0 on success
            }
        }

        // -------------------------------------------------
        // 5️⃣ Build & Push Docker Images (Docker client container)
        // -------------------------------------------------
        stage('Build & Push Docker Images') {
            agent {
                docker {
                    image 'docker:latest'                 // Docker client only
                    args '-v /var/run/docker.sock:/var/run/docker.sock' // gives container access to host daemon
                }
            }
            steps {
                script {
                    // List every micro‑service that has its own Dockerfile at the repo root
                    def services = [
                        "identity-service",
                        "student-service",
                        "teacher-service",
                        "webhook-service",
                        "analytics-service",
                        "ceo-api",
                        "api-gateway"
                    ]

                    // Use Jenkins‑provided Docker registries helper
                    docker.withRegistry("https://${DOCKER_REGISTRY}", DOCKER_CREDENTIAL_ID) {
                        services.each { service ->
                            echo "Building and pushing ${service}..."
                            // Build passes the SERVICE_NAME arg so the Dockerfile can copy the correct code
                            def image = docker.build(
                                "${DOCKER_REGISTRY}/${service}:${env.BUILD_NUMBER}",
                                "--build-arg SERVICE_NAME=${service} ."
                            )
                            // Push both the specific build number and a 'latest' tag
                            image.push()
                            image.push('latest')
                        }
                    }
                }
            }
        }

        // -------------------------------------------------
        // 6️⃣ Deploy to Kubernetes
        // -------------------------------------------------
        stage('Deploy to Kubernetes') {
            steps {
                // The withKubeConfig step injects the kubeconfig from Jenkins credentials
                withKubeConfig([credentialsId: KUBECONFIG_CREDENTIAL_ID]) {
                    echo "Deploying to namespace: institutional-platform"

                    sh "kubectl apply -f infrastructure/k8s/base-config.yaml"
                    sh "kubectl apply -f infrastructure/k8s/identity-service.yaml"
                    sh "kubectl apply -f infrastructure/k8s/business-services.yaml"
                    sh "kubectl apply -f infrastructure/k8s/event-services.yaml"
                    sh "kubectl apply -f infrastructure/k8s/ingress-services.yaml"

                    // Rolling restart forces pods to pull the newly‑pushed images
                    sh "kubectl rollout restart deployment -n institutional-platform"
                }
            }
        }
    }

    // -------------------------------------------------
    // 7️⃣ Post actions (cleanup & notifications)
    // -------------------------------------------------
    post {
        always {
            // Guarantees the workspace is cleaned so the next build starts fresh
            cleanWs()
        }
        success {
            echo "✅ Deployment successful! 🎉"
        }
        failure {
            echo "❌ Deployment failed – check the console output above."
        }
    }
}
