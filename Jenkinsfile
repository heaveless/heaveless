pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                echo 'build stage not found'
            }
        }
        stage('Test') {
            steps {
                echo 'tests stage not found'
            }
        }
        stage('Deploy') {
            steps {
                echo 'deploy is running.'
                sh 'docker run -it -p 3000:80 heaveless'
            }
        }
    }
}