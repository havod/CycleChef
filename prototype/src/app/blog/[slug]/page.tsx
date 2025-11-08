import { blogPosts } from '@/lib/data';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { PageHeader, PageHeaderHeading } from '@/components/page-header';

type BlogPostPageProps = {
  params: {
    slug: string;
  };
};

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = blogPosts.find(p => p.slug === params.slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="container relative max-w-3xl py-6 lg:py-10">
      <PageHeader>
        <PageHeaderHeading className="font-headline">{post.title}</PageHeaderHeading>
        <p className="text-muted-foreground">
          By {post.author} on {new Date(post.date).toLocaleDateString()}
        </p>
      </PageHeader>
      
      {post.image && (
        <div className="relative my-8 h-80 w-full">
          <Image
            src={post.image.imageUrl}
            alt={post.image.description}
            fill
            className="rounded-lg object-cover"
            data-ai-hint={post.image.imageHint}
          />
        </div>
      )}

      <div
        className="prose prose-neutral dark:prose-invert max-w-none [&>h3]:font-headline [&>h3]:text-2xl [&>h3]:mt-6 [&>h3]:mb-2 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:my-2"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </article>
  );
}
