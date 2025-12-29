import { ChevronLeft, ChevronRight, MoreHorizontal, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

interface ProductPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showLoadMore?: boolean;
  onLoadMore?: () => void;
  loadedCount: number;
  totalCount: number;
  isLoadingMore?: boolean;
}

export default function ProductPagination({
  currentPage,
  totalPages,
  onPageChange,
  showLoadMore = true,
  onLoadMore,
  loadedCount,
  totalCount,
  isLoadingMore = false,
}: ProductPaginationProps) {
  const { locale } = useLanguage();

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    const showPages = 5; // Max pages to show
    
    if (totalPages <= showPages + 2) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      if (currentPage > 3) {
        pages.push('ellipsis');
      }
      
      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (currentPage < totalPages - 2) {
        pages.push('ellipsis');
      }
      
      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  if (totalPages <= 1 && loadedCount >= totalCount) return null;

  return (
    <div className="flex flex-col items-center gap-4 mt-8">
      {/* Load More Button */}
      {showLoadMore && loadedCount < totalCount && onLoadMore && (
        <Button
          variant="outline"
          onClick={onLoadMore}
          disabled={isLoadingMore}
          className="w-full max-w-md h-12 border-dashed border-2 hover:bg-primary/5 hover:border-primary/50 transition-all"
        >
          {isLoadingMore ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {locale === 'zh' ? '加载中...' : 'Loading...'}
            </>
          ) : (
            <>
              {locale === 'zh' 
                ? `加载更多 (已加载 ${loadedCount}/${totalCount})` 
                : `Load More (${loadedCount}/${totalCount})`}
            </>
          )}
        </Button>
      )}

      {/* Page Numbers */}
      {totalPages > 1 && (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="h-9 w-9"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          {getPageNumbers().map((page, index) => (
            page === 'ellipsis' ? (
              <div key={`ellipsis-${index}`} className="w-9 h-9 flex items-center justify-center">
                <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
              </div>
            ) : (
              <Button
                key={page}
                variant={currentPage === page ? 'default' : 'ghost'}
                size="icon"
                onClick={() => onPageChange(page)}
                className={`h-9 w-9 ${currentPage === page ? 'bg-primary text-primary-foreground' : ''}`}
              >
                {page}
              </Button>
            )
          ))}

          <Button
            variant="ghost"
            size="icon"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="h-9 w-9"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
