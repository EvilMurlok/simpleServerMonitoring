const getAllTagsOfServers = async (projectServers, transaction) => {
    let allProjectTagsIds = new Set();
    for (let server of projectServers) {
        const serverTags = await server.getTags({}, {transaction: transaction});
        for (let serverTag of serverTags) {
            allProjectTagsIds.add(serverTag.id);
        }
    }
    return allProjectTagsIds;
}

module.exports = {getAllTagsOfServers};