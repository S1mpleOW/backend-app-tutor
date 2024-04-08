pipeline {
  agent {
    label 'jenkins-agent1'
  }

  environment {
    APP_NAME = 'backend-app-tutor'
    APP_PORT = 3000
    RUN_WITH_SYSTEMD = '/bin/bash systemd_jenkins.sh'
    USE_NODE_16 = 'echo v16.20.2 > .nvmrc '
    USE_NODE_18 = 'echo v18.0.0 > .nvmrc '
  }

  stages {
    stage('Deploy with node 16 in docker') {
      steps {
        script {
          echo "Deploying ${APP_NAME} on port ${APP_PORT}"
          sh(script: """ ${USE_NODE_16} """, label: 'use node 16')
          sh(script: """ ${RUN_WITH_SYSTEMD}  """, label: 'run with systemd')
        }
      }
    }
  }

}
