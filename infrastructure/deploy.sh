#!/bin/bash
set -e

aws-local() {
  aws --endpoint-url=http://localhost:4566 "$@"
}

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$PROJECT_ROOT"

REGION="us-east-2"
STACK_NAME="terandinav-dev"
BOOTSTRAP_STACK="terandinav-bootstrap"

# Storage
BUCKET_NAME="terandinav-deployment-bucket"

# Package the lambdas
cd ./infrastructure/lambdas/event-consumer

npm install
npx tsc -p tsconfig.json

cp package.json dist/package.json

cd dist
zip -r "$PROJECT_ROOT/infrastructure/lambdas/event-consumer.zip" .


# Deploy steps 

cd $PROJECT_ROOT/infrastructure

# Deploy the CloudFormation stack
echo "==> Creating deployment bucket..."
aws-local cloudformation deploy \
  --stack-name "$BOOTSTRAP_STACK" \
  --template-file bootstrap.yml \
  --region "$REGION"

# Upload the deployment artifact
echo "==> Uploading Lambda package..."
aws-local s3 cp lambdas/event-consumer.zip \
  "s3://${BUCKET_NAME}/event-consumer.zip" \
  --region "$REGION"

# Deploy the CloudFormation stack
echo "==> Deploying application services..."
aws-local cloudformation deploy \
  --stack-name "$STACK_NAME" \
  --template-file template.yml \
  --parameter-overrides \
    DeploymentBucket="$BUCKET_NAME" \
  --capabilities CAPABILITY_IAM \
  --region "$REGION"

echo "==> Updating lambda function code..."
aws-local lambda update-function-code --function-name event-consumer --s3-bucket terandinav-deployment-bucket --s3-key event-consumer.zip --region us-east-2
