pipeline {
  agent none

  environment {
    APP_NAME = 'backend-app-tutor'
    APP_PORT = 8000
    SHOW_NODE_VERSION = 'node --version; npm --version'
    INSTALL_DEPENDENCIES = 'npm install'
    INSTALL_DEPENDENCIES_CI  = 'npm ci'
    RUN_COMPOSE_DEV = 'npm run up:dev'
    RUN_APPLICATION = 'npm run start:dev'
  }

  stages {
    stage('Deploy with node 16 in docker') {
      agent {
        docker {
          image 'node:16.20-slim'
        }
      }
      steps {
        script {
          echo "Deploying ${APP_NAME} on port ${APP_PORT}"
          sh(script: """ ${SHOW_NODE_VERSION} """, label: 'show node version')
          sh(script: """ if ! [-f package-lock.json]; then
              ${INSTALL_DEPENDENCIES_CI}
            else
              ${INSTALL_DEPENDENCIES}
            fi
          """, label: 'install dependencies')
          sh(script: """ ${RUN_COMPOSE_DEV} """, label: 'run docker compose')
          sleep(time: 10, unit: 'SECONDS')
          sh(script: """ ${RUN_APPLICATION} """, label: 'run application')
        }
      }
    }
  }

}
