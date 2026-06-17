import { SingleArticle } from 'types';
import { STATIC_POSTS } from './postsData';

export async function getAllPosts(): Promise<SingleArticle[]> {
  return STATIC_POSTS;
}

export function getAllPostsSlugs(): string[] {
  return STATIC_POSTS.map((post) => post.slug);
}

export async function getSinglePost(slug: string): Promise<SingleArticle> {
  const post = STATIC_POSTS.find((p) => p.slug === slug);
  if (!post) {
    throw new Error(`Post not found for slug: ${slug}`);
  }
  return post;
}

export function getPostsDirectory() {
  return '';
}

