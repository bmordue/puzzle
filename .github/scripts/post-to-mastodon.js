const fs = require('fs');
const Mastodon = require('mastodon-api');

const accessToken = process.argv[2];
const filePath = process.argv[3];

const instanceURL = 'https://mastodon.instance.com'; // Replace with your Mastodon instance URL

const mastodon = new Mastodon({
    access_token: accessToken,
    api_url: `${instanceURL}/api/v1/`,
});

const mediaData = fs.readFileSync(filePath);

mastodon.post('media', { file: mediaData })
    .then(response => {
        const attachment = response.data;

        mastodon.post('statuses', {
            status: 'Check out this image!',
            media_ids: [attachment.id],
        })
            .catch(error => console.error('Error posting status:', error));
    })
    .catch(error => console.error('Error uploading media:', error));
