# AWS resources

## Inventory

- `template.yml` sets up an S3 bucket, adds permissions for an Origin Access Identity to read from that bucket (otherwise locked down) and a CloudFront distribution to use that OAI to serve content as well as redirect all traffic to HTTPS.
  It also sets up a CodePipeline, triggered by changes in a given branch and repo in GitHub. The code is passed to CodeBuild which runs the commands specified in `"buildspec.yml"` (which is checked in with the rest of the code), in essence performing unittesting and build operations. The build artefacts are then passes to CodeDeploy which deploys them to the S3 bucket configured in `hosting.yml`.

- `template-pipeline-parameters.json` is a template file containing the parameters that need to be passed to AWS when deploying the `cd-pipeline-yml` stack above. You can either create a GitHub secret and store in Systems Manager Secrete Manager, or pass in a GitHub OAuthToken, which you get from the your profile on GitHub

- `buildspec.yml` is a buildspec sample, used bu the build project in the build stage. Check in this file at the root of your project – Codepipeline will look for this file when a build is triggered.

## Deployment instructions

1. Create a new file based on `template-pipeline-parameters.json` and enter all relevant values. Note that the Github OAuth token should remain secret, so make sure to not check it in. The parameters are available in plaintext through the AWS CloudFormation console however, so best practice is to use AWS Secrets Manager, but it's a bit more tedious

2. Deploy template:

#### Option 1 - using SAM

```bash
sam build && sam deploy --guided
```

and pass in paramters through when prompted for them.

#### Option 2 - using AWS CLI

```bash
aws cloudformation deploy \
  --template-file template.yml \
  --stack-name <hosting-stack-name> \
  --capabilities CAPABILITY_IAM \
  --parameter-overrides file://secret-pipeline-parameters.json
```
