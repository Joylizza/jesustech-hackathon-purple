'use client'

import { useEffect, useState } from 'react'
import { ProductCard } from './product-card'
import { Button } from './ui/button'

interface FeaturedProduct {
  _id: string
  productId: {
    _id: string
    name: string
    country: string
    category: string[]
    description: string
    website: string
    logo?: string
  }
}

export function FeaturedProducts() {
  const [featuredProducts, setFeaturedProducts] = useState<FeaturedProduct[]>(
    []
  )
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const fetchFeaturedProducts = async (pageNum: number) => {
    try {
      setLoading(true)
      const response = await fetch(
        `/api/featured/list?page=${pageNum}&limit=10`
      )
      const data = await response.json()

      if (!data.success) {
        throw new Error('Failed to fetch featured products')
      }

      setFeaturedProducts((prev) => [...prev, ...data.data.featuredProducts])
      setHasMore(pageNum < data.data.pagination.totalPages)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFeaturedProducts(page)
  }, [page])

  const loadMore = () => {
    setPage((prev) => prev + 1)
  }

  if (error) {
    return (
      <div className='text-center py-8'>
        <p className='text-red-500'>Error: {error}</p>
      </div>
    )
  }

  return (
    <div className='space-y-8'>
      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {featuredProducts.map((featured) => (
          <ProductCard key={featured._id} product={featured.productId} />
        ))}
      </div>

      {loading && (
        <div className='text-center py-4'>
          <p>Loading...</p>
        </div>
      )}

      {hasMore && !loading && (
        <div className='text-center'>
          <Button onClick={loadMore} variant='outline'>
            Load More
          </Button>
        </div>
      )}
    </div>
  )
}
