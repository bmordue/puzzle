const fs = require('fs');
const Mastodon = require('mastodon-api');

const accessToken = process.argv[2];
const filePath = process.argv[3];

const instanceURL = 'https://mastodon.scot';

const mastodon = new Mastodon({
    access_token: accessToken,
    api_url: `${instanceURL}/api/`,
});

const mediaData = fs.readFileSync(filePath);

mastodon.post('v2/media', { file: mediaData })
    .then(response => {
        if (response.statusCode != 200) {
            // don't expect 202 for image attachment
            console.error(`Failed to post media attachment: ${response.statusCode}`);
            return;
        }
        
        const attachment = response.data;

        mastodon.post('v1/statuses', {
            status: 'New puzzle!',
            media_ids: [attachment.id],
        })
        .catch(error => console.error('Error posting status:', error));
    })
    .catch(error => console.error('Error uploading media:', error));
