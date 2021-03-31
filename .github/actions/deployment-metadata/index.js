const core = require('@actions/core');
const github = require('@actions/github');

try {

  const repoName = core.getInput('repo_name');

  const featureId = generateFeatureId();
  core.setOutput('feature-id', featureId);
  console.log(`Feature ID: "${featureId}"`);

  const deploymentName = generateDeploymentName(repoName, featureId);
  core.setOutput('deployment-name', deploymentName);
  console.log(`Deployment Name: "${deploymentName}"`);

} catch (error) {
  core.setFailed(error.message);
}

function generateFeatureId() {
  let result;

  const pr = github.context.payload.pull_request;
  if (pr) {
    const prId = github.context.payload.pull_request.number;
    result = `pr-${prId}`;
  } else {
    // TODO: pull branch name for shared branches
    result = `main`;
  }

  return sanitize(result);
}

function generateDeploymentName(repoName, featureId) {
  const result = `${repoName}-${featureId}`;
  return sanitize(result);
}

/** Sanitize a string for use in Docker tags and Helm releases. */
function sanitize(str) {
  return str
    .replace(/[\\\/\.]/g, '-');
}