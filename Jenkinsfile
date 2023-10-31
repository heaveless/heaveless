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
                sh 'docker rm -f heaveless'
                sh 'docker run -d --name heaveless -p 3000:80 heaveless:latest'
            }
        }
    }
}