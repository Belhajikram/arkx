const mongoose = require('mongoose');



const postSchema = new mongoose.Schema({
    // id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    author: { type: String, required: true},
    category: { type: String, required: true },
    description: { type: String, required: true}
}, {
    timestamps: true
})

postSchema.path('category').validate(function(value) {
    const validCategories = 'blogs';
    return validCategories.includes(value);
}, 'Invalid category');

postSchema.pre('save', function(next) {
    const now = new Date();
    this.updatedAt = now;
    if (!this.createdAt) {
        this.createdAt = now;
    }
    next();
});

const Post = mongoose.model("Post", postSchema);


module.exports = Post;

