import { GetStaticPropsContext, InferGetStaticPropsType } from 'next';
import Head from 'next/head';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import Container from 'components/Container';
import MDXRichText from 'components/MDXRichText';
import { formatDate } from 'utils/formatDate';
import { media } from 'utils/media';
import { getReadTime } from 'utils/readTime';
import Header from 'views/SingleArticlePage/Header';
import MetadataHead from 'views/SingleArticlePage/MetadataHead';
import OpenGraphHead from 'views/SingleArticlePage/OpenGraphHead';
import ShareWidget from 'views/SingleArticlePage/ShareWidget';
import StructuredDataHead from 'views/SingleArticlePage/StructuredDataHead';
import { getAllPostsSlugs, getSinglePost } from 'utils/postsFetcher';
import { SingleArticle } from 'types';
import { EnvVars } from 'env';

type BlogPostProps = {
  slug: string;
  mdxSource: MDXRemoteSerializeResult;
  meta: SingleArticle['meta'];
};

export default function SingleArticlePage(props: InferGetStaticPropsType<typeof getStaticProps>) {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [readTime, setReadTime] = useState('');
  const { slug, mdxSource, meta } = props;
  const { title, description, date, tags, imageUrl } = meta;
  const formattedDate = formatDate(new Date(date));
  const absoluteImageUrl = imageUrl.replace(/\/+/, '/');

  useEffect(() => {
    calculateReadTime();
    lazyLoadPrismTheme();

    function calculateReadTime() {
      const currentContent = contentRef.current;
      if (currentContent) {
        setReadTime(getReadTime(currentContent.textContent || ''));
      }
    }

    function lazyLoadPrismTheme() {
      const prismThemeLinkEl = document.querySelector('link[data-id="logoipsum/prism-theme"]');

      if (!prismThemeLinkEl) {
        const headEl = document.querySelector('head');
        if (headEl) {
          const newEl = document.createElement('link');
          newEl.setAttribute('data-id', 'logoipsum/prism-theme');
          newEl.setAttribute('rel', 'stylesheet');
          newEl.setAttribute('href', `${EnvVars.BASE_PATH}/logoipsum/prism-theme.css`);
          newEl.setAttribute('media', 'print');
          newEl.setAttribute('onload', "this.media='all'; this.onload=null;");
          headEl.appendChild(newEl);
        }
      }
    }
  }, []);

  return (
    <>
      <Head>
        <noscript>
          <link rel="stylesheet" href={`${EnvVars.BASE_PATH}/logoipsum/prism-theme.css`} />
        </noscript>
      </Head>
      <OpenGraphHead slug={slug} title={title} description={description} date={date} tags={tags} author="" />
      <StructuredDataHead slug={slug} title={title} description={description} date={date} tags={tags} author="" />
      <MetadataHead title={title} description={description} author="" />
      <CustomContainer id="content" ref={contentRef}>
        <ShareWidget title={title} slug={slug} />
        <Header title={title} formattedDate={formattedDate} imageUrl={absoluteImageUrl} readTime={readTime} />
        <MDXRichText content={mdxSource} />
      </CustomContainer>
    </>
  );
}

export async function getStaticPaths() {
  const slugs = getAllPostsSlugs();
  return {
    paths: slugs.map((slug) => ({ params: { slug } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }: GetStaticPropsContext<{ slug: string }>) {
  const { slug } = params as { slug: string };
  const post = await getSinglePost(slug);
  const mdxSource = await serialize(post.content, {
    mdxOptions: {
      remarkPlugins: [],
      rehypePlugins: [],
    },
  });

  return {
    props: {
      slug,
      mdxSource,
      meta: post.meta,
    },
  };
}

const CustomContainer = styled(Container)`
  position: relative;
  max-width: 90rem;
  margin: 10rem auto;

  ${media('<=tablet')} {
    margin: 5rem auto;
  }
`;
