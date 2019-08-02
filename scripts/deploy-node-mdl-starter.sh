#!/bin/bash

set -e

GITHUB_USERNAME=$GITHUB_USERNAME
PROJECT_NAME=$PROJECT_NAME
GENERATOR_NODE_MDL_VERSION=$TRAVIS_TAG

cd $PROJECT_NAME

if [ $( git diff origin/master | wc -l ) -ne 0 ]
then
  if [ `echo $GENERATOR_NODE_MDL_VERSION | tail -c 3` == ".0" ]
  then
    COMMIT_TYPE="feat"
  else
    COMMIT_TYPE="fix"
  fi

  echo "Deploying ${PROJECT_NAME} generated using generator-node-mdl ${GENERATOR_NODE_MDL_VERSION}"

  set -v

  git reset origin/master
  git add .
  git commit -m "${COMMIT_TYPE}(init): updated using generator-node-mdl ${GENERATOR_NODE_MDL_VERSION} 🔥"
  git push origin master

  unset -v

  echo "Deployed to: https://github.com/${GITHUB_USERNAME}/${PROJECT_NAME}"
else
  echo "Project node-mdl-starter hasn't changed afet running generator-node-mdl ${GENERATOR_NODE_MDL_VERSION}"
  echo "Nothing to deploy"
fi
