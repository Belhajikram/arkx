const express = require('express');
const postRouter = express.Router();
const postController = require('../controllers/postController');


postRouter.get('/', postController.getAll);

postRouter.post('/', postController.createPost);

postRouter.get('/:id', postController.getById);

postRouter.put('/posts/:id', postController.updatePost);

postRouter.delete('/posts/:id', postController.deletePost);


module.exports = postRouter;
