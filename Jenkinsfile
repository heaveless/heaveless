pipeline {
    agent any
    stages {
        stage('Test') {
            steps {
                echo 'tests stage not found'
            }
        }
        stage('Build') {
            steps {
                sh 'docker build . -t heaveless:latest'
            }
        }
        stage('Deploy') {
            steps {
                sh 'docker run --name heaveless -p 3000:80 heaveless:latest'
            }
        }
    }
}