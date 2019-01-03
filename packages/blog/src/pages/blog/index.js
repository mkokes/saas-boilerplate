import { graphql } from "gatsby";
import React from "react";
import { format as formatDate } from "date-fns";
import BlogLayout from "../../components/blog-layout";

const postUrl = post => "/blog" + post.fields.slug;

const PostPreview = ({ post }) => (
  <div className="blog-preview">
    <h3>
      <a href={postUrl(post)}>{post.frontmatter.title}</a>
    </h3>
    <span className="post-date">
      <time dateTime="{ post.frontmatter.date}">
        {formatDate(post.frontmatter.date, "MMM DD, YYYY")}
      </time>
    </span>
    <br />
    <p>{post.excerpt}</p>
    <p>
      <a href={postUrl(post)}>Read more...</a>
    </p>
  </div>
);

const BlogIndex = ({ data }) => {
  const posts = data.allMarkdownRemark.edges.map(post => (
    <PostPreview key={post.node.id} post={post.node} />
  ));
  return (
    <BlogLayout>
      <h2>Blog</h2>
      <div className="blog-preview-list">{posts}</div>
    </BlogLayout>
  );
};

export const query = graphql`
  query IndexQuery {
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          id
          excerpt
          fileAbsolutePath
          frontmatter {
            title
            date
          }
          fields {
            slug
          }
        }
      }
    }
  }
`;

export default BlogIndex;
