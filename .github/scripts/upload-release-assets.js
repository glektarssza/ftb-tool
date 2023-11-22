const fs = require('node:fs/promises');
const path = require('node:path');

module.exports = async ({ github, context, core }) => {
    const { owner, repo } = context.repo;
    const items = (await fs.readdir('./dist/', {
        withFileTypes: true,
        encoding: 'utf-8'
    })).filter((item) => item.isFile());
    core.info(`Uploading ${items.length} assets to release ${context.event.release.id}...`);
    for (const artifact of items) {
        const artifactPath = path.join(artifact.path, artifact.name);
        core.info(`Reading ${artifact.name} from ${artifactPath}...`);
        const data = await fs.readFile(artifactPath);
        core.info(`Uploading ${artifact.name} to release...`);
        await github.rest.repos.uploadReleaseAsset({
            owner,
            repo,
            release_id: context.event.release.id,
            name: artifact.name,
            data
        });
    }
    core.info('All release assets uploaded!');
};
