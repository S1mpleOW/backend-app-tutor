pipeline {
  agent none

  environment {
    APP_NAME = 'backend-app-tutor'
    APP_PORT = 8000
    SHOW_NODE_VERSION = 'node --version; npm --version'

  }

  stages {
    stage('Deploy with node 16') {
      agent {
        docker {
          image 'node:16.20-slim'
        }
      }
      steps {
        script {
          echo "Deploying ${APP_NAME} on port ${APP_PORT}"
          sh(script: """ ${SHOW_NODE_VERSION} """, label: 'show node version')
        }
      }
    }
  }

}
