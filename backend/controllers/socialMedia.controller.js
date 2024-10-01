const YOUR_TWITTER_ID = 'your-twitter-id';

router.get('/check-follow', async (req, res) => {
  const { platform } = req.query;
  const userId = req.user.id; // Assumes user authentication is implemented

  if (platform === 'twitter') {
    try {
      // Check if the user follows your Twitter account
      const result = await client.get('friendships/show', {
        source_id: userId,
        target_id: YOUR_TWITTER_ID,
      });

      if (result.relationship.source.following) {
        return res.json({ followed: true });
      } else {
        return res.json({ followed: false });
      }
    } catch (error) {
      console.error('Twitter API Error:', error);
      return res.status(500).json({ error: 'Failed to check follow status' });
    }
  } else {
    return res.status(400).json({ error: 'Invalid platform' });
  }
});