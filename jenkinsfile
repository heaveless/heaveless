pipeline {
    agent any
    stages {
        stage('build') {
            echo 'build stage not found'
        }

        stage('tests') {
            echo 'tests stage not found'
        }

        stages('deploy') {
            steps {
                sh 'docker-compose down -v'
                sh 'docker-compose up -d --build'
            }
        }
    }
}