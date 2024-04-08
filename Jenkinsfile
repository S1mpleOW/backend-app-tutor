pipeline {
  agent {
    label 'jenkins-agent1'
  }

  environment {
    APP_NAME = 'backend-app-tutor'
    APP_PORT = 8000
    SHOW_NODE_VERSION = 'node --version; npm --version'
    RUN_WITH_SYSTEMD = '/bin/bash systemd_jenkins.sh'
  }

  stages {
    stage('Deploy with node 16 in docker') {
      steps {
        script {
          echo "Deploying ${APP_NAME} on port ${APP_PORT}"
          sh(script: """ ${SHOW_NODE_VERSION} """, label: 'show node version')
          sh(script: """ ${RUN_WITH_SYSTEMD} """, label: 'run with systemd')
        }
      }
    }
  }

}
