const Post = require('../models/postModel');
const ViewedPost = require('../models/viewedPostModel');
const { Op } = require('sequelize');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// Create post
exports.createPost = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  try {
    const post = await Post.create({
      username: req.user.username,
      photoPath: req.file.path,
    });
    res.json({ message: 'Post uploaded successfully', post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error uploading post' });
  }
};

//fetch posts
exports.getFeed = async (req, res) => {
  const { page = 1, limit = 4 } = req.query;
  const { username } = req.user;

  try {
    // get viewed posts
    const viewedPost = await ViewedPost.findAll({
      where: { username },
      attributes: ['postId'],
    });
    const viewedPostIds =
      viewedPost.length > 0 ? viewedPost.map((vp) => vp.postId) : [];

    // get unseen posts
    const unseenPosts = await Post.findAll({
      where: {
        id: {
          [Op.notIn]: viewedPostIds.length > 0 ? viewedPostIds : [0],
        },
      },
      limit,
      offset: (page - 1) * limit,
      order: [['createdAt', 'DESC']],
    });

    if (unseenPosts.length > 0) {
      return res.json({
        posts: unseenPosts,
        hasMore: unseenPosts.length === limit, 
        seen: false,
      });
    }

    const seenPosts = await Post.findAll({
      where: {
        id: {
          [Op.in]: viewedPostIds,
        },
      },
      limit,
      offset: (page - 1) * limit,
      order: [['createdAt', 'DESC']],
    });

    const hasMoreSeenPosts = seenPosts.length === limit;

    return res.json({
      posts: seenPosts, 
      hasMore: hasMoreSeenPosts, 
      seen: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching posts' });
  }
};

// Mark a post as viewed
exports.markPostAsViewed = async (req, res) => {
  const { postId } = req.body;
  const { username } = req.user;

  // Validate
  if (!Array.isArray(postId) || postId.length === 0) {
    return res.status(400).json({ message: 'Invalid post IDs' });
  }

  try {
    // creating array of post for bulk insertion
    const viewedPosts = postId.map((postId) => ({
      username,
      postId,
    }));

    await ViewedPost.bulkCreate(viewedPosts, { ignoreDuplicates: true }); 
    res.status(201).json({ message: 'Posts marked as viewed' });
  } catch (error) {
    console.error('Error marking posts as viewed:', error);

    if (error.name === 'SequelizeUniqueConstraintError') {
      return res
        .status(200)
        .json({ message: 'Some posts already marked as viewed' });
    }

    res.status(500).json({ message: 'Error marking posts as viewed' });
  }
};
