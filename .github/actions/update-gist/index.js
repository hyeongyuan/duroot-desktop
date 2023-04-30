const core = require('@actions/core');
const github = require('@actions/github');
const axios = require('axios');

const GIST_ID = '8bd4a8d0481a7be2d657d8846f78b20c';
const FILE_NAME = 'lastest-version.json';
const PLATFORM_MAC = 'darwin-x86_64';

const run = async () => {
  try {
    const time = (new Date()).toTimeString();
    core.setOutput("time", time);
    // Get the JSON webhook payload for the event that triggered the workflow
    const payload = JSON.stringify(github.context.payload, undefined, 2);
    console.log(`The event payload: ${payload}`);
  
    const { data } = await axios.get(`https://api.github.com/gists/${GIST_ID}`);
    const { content } = data.files[FILE_NAME];

    const { version, platforms } = JSON.parse(content);
    const { signature, url } = platforms[PLATFORM_MAC];

    console.log(JSON.stringify({version, signature, url}, undefined, 2));
  } catch (error) {
    core.setFailed(error.message);
  }
};


run();