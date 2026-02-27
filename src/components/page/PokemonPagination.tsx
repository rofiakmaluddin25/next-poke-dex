import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PokemonPaginationProps {
  currentPage: number;
  totalPages: number;
  basePath?: string;
  onPageChange?: (page: number) => void;
}

function getPageRange(current: number, total: number): (number | "...")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  if (current <= 4) {
    return [1, 2, 3, 4, 5, "...", total];
  }
  if (current >= total - 3) {
    return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
  }
  return [1, "...", current - 1, current, current + 1, "...", total];
}

export default function PokemonPagination({
  currentPage,
  totalPages,
  basePath = "/",
  onPageChange,
}: PokemonPaginationProps) {
  if (totalPages <= 1) return null;

  const pageHref = (page: number) =>
    onPageChange ? "#" : `${basePath}?page=${page}`;

  const handleClick =
    (page: number) => (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (onPageChange) {
        e.preventDefault();
        onPageChange(page);
      }
    };

  const pages = getPageRange(currentPage, totalPages);

  return (
    <Pagination className="my-8">
      <PaginationContent>
        {/* Previous */}
        <PaginationItem>
          <PaginationPrevious
            href={currentPage > 1 ? pageHref(currentPage - 1) : "#"}
            onClick={handleClick(currentPage - 1)}
            aria-disabled={currentPage === 1}
            className={
              currentPage === 1 ? "pointer-events-none opacity-40" : ""
            }
          />
        </PaginationItem>

        {/* Page numbers */}
        {pages.map((page, i) =>
          page === "..." ? (
            <PaginationItem key={`ellipsis-${i}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={page}>
              <PaginationLink
                href={pageHref(page)}
                onClick={handleClick(page)}
                isActive={page === currentPage}
                className={
                  page === currentPage
                    ? "border-blue-500 bg-blue-600 text-white hover:bg-blue-500 hover:text-white"
                    : ""
                }
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ),
        )}

        {/* Next */}
        <PaginationItem>
          <PaginationNext
            href={currentPage < totalPages ? pageHref(currentPage + 1) : "#"}
            onClick={handleClick(currentPage + 1)}
            aria-disabled={currentPage === totalPages}
            className={
              currentPage === totalPages ? "pointer-events-none opacity-40" : ""
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
