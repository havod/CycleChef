import Link from 'next/link';
import Image from 'next/image';
import { blogPosts } from '@/lib/data';
import { PageHeader, PageHeaderDescription, PageHeaderHeading } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function BlogPage() {
  return (
    <div className="container relative">
      <PageHeader className="pb-8">
        <PageHeaderHeading className="font-headline">Community Blog</PageHeaderHeading>
        <PageHeaderDescription>
          Share experiences, tips, and stories about nutrition, health, and well-being.
        </PageHeaderDescription>
      </PageHeader>
      <div className="grid gap-8">
        {blogPosts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="block group">
            <Card className="overflow-hidden transition-shadow hover:shadow-lg">
                <div className="grid md:grid-cols-5 gap-4">
                    {post.image && (
                    <div className="md:col-span-2 relative h-64 md:h-auto">
                        <Image
                        src={post.image.imageUrl}
                        alt={post.image.description}
                        fill
                        className="object-cover"
                        data-ai-hint={post.image.imageHint}
                        />
                    </div>
                    )}
                    <div className="md:col-span-3">
                        <CardHeader>
                            <CardTitle className="font-headline text-2xl group-hover:text-primary transition-colors">{post.title}</CardTitle>
                            <CardDescription>By {post.author} on {new Date(post.date).toLocaleDateString()}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground mb-4">{post.description}</p>
                            <Button variant="link" className="p-0">
                                Read more <ArrowRight className="ml-2 size-4" />
                            </Button>
                        </CardContent>
                    </div>
                </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
