const fs = require('node:fs/promises');
const path = require('node:path');

/**
 * Get all items in a directory recursively.
 *
 * @param {string} directory The path to the directory to scan.
 *
 * @returns {Promise<fs.Dirent[]>} A promise that resolves to an array of
 * `fs.Dirent` objects.
 */
async function getItemsRecursive(directory) {
    const items = await fs.readdir(directory, {
        withFileTypes: true,
        encoding: 'utf-8'
    });
    const results = [];
    for (const item of items) {
        if (item.isDirectory()) {
            const subItems = await getItemsRecursive(path.join(item.path, item.name));
            results.push(...subItems);
        } else {
            results.push(item);
        }
    }
    return results;
}

/**
 * Upload all files in a directory to a release.
 *
 * @param {object} param0 The GitHub context object.
 * @param {string} artifactDirectory The path to the directory containing the
 * artifacts to upload.
 *
 * @returns {Promise<void>} A promise that resolves when all assets have been
 * uploaded.
 */
module.exports = async ({ github, context, core }, artifactDirectory) => {
    const { owner, repo } = context.repo;
    const items = await getItemsRecursive(artifactDirectory);
    const assets = items.filter((item) => item.isFile());
    core.info(`Uploading ${assets.length} assets to release ${context.payload.release.id}...`);
    for (const artifact of assets) {
        const artifactPath = path.join(artifact.path, artifact.name);
        let artifactName = path.basename(artifact.path);
        if (path.extname(artifact.name) === '.exe') {
            artifactName += '.exe';
        }
        core.info(`Reading ${artifact.name} from ${artifactPath}...`);
        const data = await fs.readFile(artifactPath);
        core.info(`Uploading to release as ${artifactName}...`);
        await github.rest.repos.uploadReleaseAsset({
            owner,
            repo,
            release_id: context.payload.release.id,
            name: artifactName,
            data
        });
    }
    core.info('All release assets uploaded!');
};
