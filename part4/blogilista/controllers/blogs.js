const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogsRouter.post("/", async (request, response) => {
  const { title, author, url, likes } = request.body;

  if (!title || !url) {
    return response.status(400).json({ error: "title and url are required" });
  }

  const blog = new Blog({
    title,
    author,
    url,
    likes: likes === undefined ? 0 : likes
  });

  const savedBlog = await blog.save()
  response.status(201).json(savedBlog)
});

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const { likes } = request.body;

  // Update only the likes field of the blog
  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    { likes: likes },
    { new: true}
  );

  if (updatedBlog) {
    response.json(updatedBlog);
  } else {
    response.status(404).end();  // If no blog was found with the given ID
  }
});

module.exports = blogsRouter;
