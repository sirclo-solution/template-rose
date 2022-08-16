import org.jenkinsci.plugins.pipeline.modeldefinition.Utils
pipeline {
    agent none
    environment {
        CLUSTER_STAGING = 'kubernetes-sirclo-staging'
        CLUSTER_PROD    = 'kubernetes-sirclo-prod'
        ENTRYPOINT      = '/home/jenkins/entrypoint/entrypoint.sh'
    }
    stages {
        stage("are you sure to release to staging?") {
            steps {
                script {
                    try {
                        timeout(time: 24, unit: "HOURS") {
                            input( message: 'release to staging', ok: 'deploy')
                        }
                    } catch (Throwable e) {
                        env.SKIP_DEPLOY_STAGING = "true"
                        echo "Caught ${e.toString()}"
                        Utils.markStageSkippedForConditional('are you sure to release to staging?')
                    }
                }
            }
        }
        stage("release to staging") {
            agent {
                kubernetes {
                  cloud "${CLUSTER_STAGING}"
                  inheritFrom 'jenkins-agent'
                }
            }
            steps {
                script {
                    if (env.SKIP_DEPLOY_STAGING == 'true') {
                        Utils.markStageSkippedForConditional('release to staging')
                    } else {
                        container('deployer') {
                            sh "${ENTRYPOINT}"
                            sh "gcloud auth activate-service-account --key-file /etc/service_key/service-account-key.json"
                            sh "cp staging.Dockerfile deployment.Dockerfile"
                            sh "full_detail=\$(deployer --build-from-pod --only-build-docker --build-docker-tag=${GIT_COMMIT}-${BUILD_NUMBER} | grep Image) && \
                                dockerimage=\$(echo \$full_detail |  cut -d ' ' -f3  ) && \
                                id=\$(docker create \$dockerimage ) && \
                                mkdir -p /tmp/\$dockerimage/static && \
                                mkdir -p /tmp/\$dockerimage/webfonts && \
                                docker cp \$id:/usr/src/app/.next/static /tmp/\$dockerimage/ && \
                                docker cp \$id:/usr/src/app/public/webfonts /tmp/\$dockerimage/ && \
                                gsutil cp -r /tmp/\$dockerimage/static gs://sirclo-1152-templates/rose/_next/ && \
                                docker rm -v \$id"
                            sh "deployer --build-from-pod --use-helmfile --use-jenkins-agent --project=sirclo-nonprod --docker-tag=${GIT_COMMIT}-${BUILD_NUMBER}"
                            sh """
                                curl -X POST --data-urlencode \"payload={'channel': '#template-deployment', 'username': 'Jenkins Build', 'text': "[Blocked Production] ${env.JOB_BASE_NAME} (${env.BRANCH_NAME} #${BUILD_NUMBER}) <${BUILD_URL}|View Build>", 'icon_emoji': ':jenkins:'}\" https://hooks.slack.com/services/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
                            """
                        }
                    }
                }
            }
        }
        stage("are you sure to release to production?") {
            steps {
                script {
                    if (env.SKIP_DEPLOY_STAGING == 'true') {
                        env.SKIP_DEPLOY_PROD = "true"
                        Utils.markStageSkippedForConditional('are you sure to release to production?')
                    } else {
                        try {
                            timeout(time: 24, unit: "HOURS") {
                                input( message: 'release to production', ok: 'deploy')
                            }
                        } catch (Throwable e) {
                            env.SKIP_DEPLOY_PROD = "true"
                            echo "Caught ${e.toString()}"
                            Utils.markStageSkippedForConditional('are you sure to release to production?')
                        }                        
                    }
                }
            }
        }
        stage("release to production") {
            agent {
                kubernetes {
                  cloud "${CLUSTER_PROD}"
                  inheritFrom 'jenkins-agent'
                }
            }
            steps {
                script {
                    if (env.SKIP_DEPLOY_PROD == 'true' || env.SKIP_DEPLOY_STAGING == 'true') {
                        Utils.markStageSkippedForConditional('release to production')
                    } else {
                        container('deployer') {
                            sh "${ENTRYPOINT}"
                            sh "gcloud auth activate-service-account --key-file /etc/service_key/service-account-key.json"
                            sh "cp production.Dockerfile deployment.Dockerfile"
                            sh "full_detail=\$(deployer --build-from-pod --only-build-docker --build-docker-tag=${GIT_COMMIT}-${BUILD_NUMBER} | grep Image) && \
                                dockerimage=\$(echo \$full_detail |  cut -d ' ' -f3 ) && \
                                id=\$(docker create \$dockerimage ) && \
                                mkdir -p /tmp/\$dockerimage/static && \
                                mkdir -p /tmp/\$dockerimage/webfonts && \
                                docker cp \$id:/usr/src/app/.next/static /tmp/\$dockerimage/ && \
                                docker cp \$id:/usr/src/app/public/webfonts /tmp/\$dockerimage/ && \
                                gsutil cp -r /tmp/\$dockerimage/static gs://sirclo-template/rose/_next/ && \
                                docker rm -v \$id"
                            sh "deployer --build-from-pod --use-helmfile --use-jenkins-agent --project=sirclo-prod --docker-tag=${GIT_COMMIT}-${BUILD_NUMBER}"
                            sh """
                                curl -X POST --data-urlencode \"payload={'channel': '#template-deployment', 'username': 'Jenkins Build', 'text': "[Released to Production] :rocket: ${env.JOB_BASE_NAME} (${env.BRANCH_NAME} #${BUILD_NUMBER}) <${BUILD_URL}|View Build>", 'icon_emoji': ':jenkins:'}\" https://hooks.slack.com/services/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
                            """
                        }
                    }
                }
            }
        }
    }
}