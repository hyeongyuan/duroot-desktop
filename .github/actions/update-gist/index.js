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

const updateGist = async (id, content) => {
  await axios.patch(`https://api.github.com/gists/${id}`, {
    files: {
      ['latest-version.json']: {
        content: JSON.stringify(content, undefined, 2),
      },
    },
  }, {
    headers: {
      Authorization: `Bearer ${core.getInput('token')}`,
    },
  });
};

const updateGistContent = (content, { version, signature }) => {
  return {
    ...content,
    version,
    pub_date: new Date().toISOString(),
    platforms: {
      ...content.platforms,
      [PLATFORM_MAC]: {
        ...content.platforms[PLATFORM_MAC],
        url: `https://github.com/hyeongyuan/duroot-desktop/releases/download/release-${version}/Duroot.app.tar.gz`,
        signature,
      },
    },
  };
};


const run = async () => {
  try {
    const payload = JSON.stringify(github.context.payload, undefined, 2);
    console.log(`The event payload: ${payload}`);

    const { release: { tag_name, assets } } = github.context.payload;
    const [, nextVersion] = tag_name.split('-');

    const sigAsset = assets.find(asset => asset.name.includes('.sig'));
    if (!sigAsset) {
      core.setFailed('Not found .sig file');
      return;
    }
    const { data: sigContent } = await axios.get(sigAsset.browser_download_url);
  
    const gistContent = await getGist(GIST_ID);

    const nextGistContent = updateGistContent(gistContent, { version: nextVersion, signature: sigContent });

    await updateGist('7c2b19d446d46ef6e14f72f2bd1d224c', nextGistContent);
    console.log(`Success to update file:\n${JSON.stringify(nextGistContent, undefined, 2)}`);
  } catch (error) {
    core.setFailed(error.message);
  }
};

run();
