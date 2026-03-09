'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Search, X, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useDebounce } from '@/hooks/use-debounce'
import { searchApi, SearchResult } from '@/lib/api/search'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export function SearchBar() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const debouncedQuery = useDebounce(query, 300)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  // 快捷键 / 聚焦搜索
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !isOpen) {
        e.preventDefault()
        setIsOpen(true)
        setTimeout(() => inputRef.current?.focus(), 0)
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
        setQuery('')
        setResults([])
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  // 点击外部关闭
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
        setQuery('')
        setResults([])
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // 执行搜索
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([])
      return
    }

    const performSearch = async () => {
      setLoading(true)
      try {
        const data = await searchApi.search(debouncedQuery)
        setResults(data.articles)
        setSelectedIndex(-1)
      } catch (error) {
        console.error('搜索失败:', error)
        setResults([])
      } finally {
        setLoading(false)
      }
    }

    performSearch()
  }, [debouncedQuery])

  // 键盘导航
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => Math.min(prev + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => Math.max(prev - 1, -1))
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault()
      const result = results[selectedIndex]
      if (result) {
        window.location.href = `/posts/${result.id}`
      }
    }
  }, [results, selectedIndex])

  // 滚动到选中项
  useEffect(() => {
    if (selectedIndex >= 0 && resultsRef.current) {
      const selectedElement = resultsRef.current.children[selectedIndex] as HTMLElement
      selectedElement?.scrollIntoView({ block: 'nearest' })
    }
  }, [selectedIndex])

  const handleClear = () => {
    setQuery('')
    setResults([])
    inputRef.current?.focus()
  }

  const handleResultClick = () => {
    setIsOpen(false)
    setQuery('')
    setResults([])
  }

  return (
    <div ref={containerRef} className="relative">
      {/* 搜索图标按钮 */}
      <button
        onClick={() => {
          setIsOpen(true)
          setTimeout(() => inputRef.current?.focus(), 0)
        }}
        className={cn(
          "p-2 rounded-lg transition-colors hover:bg-muted",
          isOpen && "hidden"
        )}
        aria-label="搜索"
      >
        <Search className="w-5 h-5 text-muted-foreground" />
      </button>

      {/* 展开的搜索框 */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:static md:inset-auto">
          {/* 移动端背景遮罩 */}
          <div 
            className="fixed inset-0 bg-black/50 md:hidden"
            onClick={() => setIsOpen(false)}
          />

          {/* 搜索容器 */}
          <div className="fixed top-0 left-0 right-0 bg-background border-b md:static md:border md:rounded-lg md:w-96">
            <div className="flex items-center gap-2 p-3 md:p-2">
              <Search className="w-5 h-5 text-muted-foreground shrink-0" />
              <Input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="搜索文章..."
                className="border-0 shadow-none focus-visible:ring-0 text-base"
                autoFocus
              />
              {loading && (
                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
              )}
              {query && !loading && (
                <button
                  onClick={handleClear}
                  className="p-1 rounded hover:bg-muted"
                  aria-label="清除"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              )}
            </div>

            {/* 搜索结果面板 */}
            {(results.length > 0 || (debouncedQuery && !loading && results.length === 0)) && (
              <div 
                ref={resultsRef}
                className="border-t max-h-80 overflow-y-auto"
              >
                {results.length > 0 ? (
                  results.map((result, index) => (
                    <Link
                      key={result.id}
                      href={`/posts/${result.id}`}
                      onClick={handleResultClick}
                      className={cn(
                        "block p-3 hover:bg-muted transition-colors cursor-pointer",
                        selectedIndex === index && "bg-muted"
                      )}
                    >
                      <div className="font-medium text-sm mb-1">
                        {result.highlight?.title?.[0] || result.title}
                      </div>
                      {result.excerpt && (
                        <p 
                          className="text-xs text-muted-foreground line-clamp-2"
                          dangerouslySetInnerHTML={{ 
                            __html: result.highlight?.content?.[0] || result.excerpt 
                          }}
                        />
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        {result.tags?.slice(0, 3).map(tag => (
                          <span 
                            key={tag.id}
                            className="text-xs px-2 py-0.5 bg-muted rounded"
                          >
                            {tag.name}
                          </span>
                        ))}
                        {result.author && (
                          <span className="text-xs text-muted-foreground">
                            {result.author.username}
                          </span>
                        )}
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="p-4 text-center text-muted-foreground text-sm">
                    未找到相关文章
                    <Link 
                      href="/posts" 
                      className="block mt-2 text-primary hover:underline"
                      onClick={handleResultClick}
                    >
                      查看全部文章
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* 快捷键提示 */}
            <div className="hidden md:flex items-center justify-between px-3 py-2 border-t text-xs text-muted-foreground">
              <span><kbd className="px-1.5 py-0.5 bg-muted rounded">/</kbd> 快速搜索</span>
              <span><kbd className="px-1.5 py-0.5 bg-muted rounded">↑↓</kbd> 导航 <kbd className="px-1.5 py-0.5 bg-muted rounded">Enter</kbd> 打开</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}