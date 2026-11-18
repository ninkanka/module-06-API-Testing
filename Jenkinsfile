pipeline {
    agent any

    triggers {
        cron('H */2 * * *')
    }

    stages {
        stage('Install') {
            steps {
                bat 'npm ci'
            }
        }
        stage('API tests') {
            steps {
                bat 'npm run test:api'
            }
        }
    }
}