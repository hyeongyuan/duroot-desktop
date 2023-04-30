const core = require('@actions/core');
const github = require('@actions/github');
const axios = require('axios');

const GIST_ID = '8bd4a8d0481a7be2d657d8846f78b20c';
const FILE_NAME = 'lastest-version.json';
const PLATFORM_MAC = 'darwin-x86_64';

const getGist = async id => {
  const { data } = await axios.get(`https://api.github.com/gists/${id}`);
  const { content } = data.files[FILE_NAME];

  return JSON.parse(content);
};

const run = async () => {
  try {
    // Get the JSON webhook payload for the event that triggered the workflow
    const payload = JSON.stringify(github.context.payload, undefined, 2);
    console.log(`The event payload: ${payload}`);

    const { release: { tag_name, assets } } = github.context.payload;
    const [, nextVersion] = tag_name.split('-');

    const sigAsset = assets.find(asset => asset.name.includes('.sig'));

    const { data: sigData } = await axios.get(sigAsset.browser_download_url);

    console.log(sigData);
  
    const latestVersion = await getGist(GIST_ID);

    latestVersion.version = nextVersion;
    latestVersion.pub_date = new Date().toISOString();
    latestVersion.platforms[PLATFORM_MAC].url = `https://github.com/hyeongyuan/duroot-desktop/releases/download/release-${nextVersion}/Duroot.app.tar.gz`;
    latestVersion.platforms[PLATFORM_MAC].signature = 'new sig';

    console.log(JSON.stringify(latestVersion, undefined, 2));
  } catch (error) {
    core.setFailed(error.message);
  }
};


run();