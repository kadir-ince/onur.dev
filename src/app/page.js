import { Suspense } from 'react'
import Link from 'next/link'

import { ScrollArea } from '@/components/scroll-area'
import { LoadingSpinner } from '@/components/loading-spinner'
import { WritingList } from '@/components/writing-list'
import { FloatingHeader } from '@/components/floating-header'
import { PageTitle } from '@/components/page-title'
import { Button } from '@/components/ui/button.jsx'
import { getAllPosts } from '@/lib/contentful'
import { getSortedPosts } from '@/lib/utils'

async function fetchData() {
  const allPosts = await getAllPosts()
  const sortedPosts = getSortedPosts(allPosts)
  return { sortedPosts }
}

export default async function Home() {
  const { sortedPosts } = await fetchData()

  return (
    <ScrollArea useScrollAreaId>
      <FloatingHeader scrollTitle="Onur Şuyalçınkaya" />
      <div className="content-wrapper">
        <div className="content">
          <PageTitle title="Home" className="lg:hidden" />
          <p>
            Hi 👋 I'm Onur (meaning "Honour" in English), a software engineer, dj, writer, and minimalist based in
            Amsterdam, The Netherlands.
          </p>
          <p>
            I develop things as a Senior Frontend Software Engineer at Bitvavo. Previously, I worked as a Senior
            Frontend Software Engineer at heycar, Frontend Software Engineer at Yemeksepeti, Fullstack Software Engineer
            at Sistas, Mobile Developer at Tanbula, and Specialist at Apple.
          </p>
          <Suspense fallback={<LoadingSpinner />}>
            <Button asChild variant="link" className="inline px-0">
              <Link href="/writing">
                <h2 className="mb-4 mt-8">Writing</h2>
              </Link>
            </Button>
            <WritingList items={sortedPosts} header="Writing" />
          </Suspense>
        </div>
      </div>
    </ScrollArea>
  )
}
