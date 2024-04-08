pipeline {
  agent 'jenkins-agent1'

  environment {
    APP_NAME = 'backend-app-tutor'
    APP_PORT = 8000
    SHOW_NODE_VERSION = 'node --version; npm --version'
    INSTALL_DEPENDENCIES = 'npm install'
    INSTALL_DEPENDENCIES_CI  = 'npm ci'
  }

  stages {
    stage('Deploy with node 16 in docker') {
      steps {
        script {
          echo "Deploying ${APP_NAME} on port ${APP_PORT}"
          sh(script: """ ${SHOW_NODE_VERSION} """, label: 'show node version')

        }
      }
    }
  }

}
