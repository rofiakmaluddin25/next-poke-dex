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
}: PokemonPaginationProps) {
  if (totalPages <= 1) return null;

  const pageHref = (page: number) => `${basePath}?page=${page}`;

  const pages = getPageRange(currentPage, totalPages);

  return (
    <Pagination className="my-8">
      <PaginationContent>
        {/* Previous */}
        <PaginationItem>
          <PaginationPrevious
            href={currentPage > 1 ? pageHref(currentPage - 1) : "#"}
            aria-disabled={currentPage === 1}
            className={
              currentPage === 1
                ? "pointer-events-none opacity-40"
                : "text-white hover:bg-white/10 hover:text-white"
            }
          />
        </PaginationItem>

        {/* Page numbers */}
        {pages.map((page, i) =>
          page === "..." ? (
            <PaginationItem key={`ellipsis-${i}`}>
              <PaginationEllipsis className="text-gray-400" />
            </PaginationItem>
          ) : (
            <PaginationItem key={page}>
              <PaginationLink
                href={pageHref(page)}
                isActive={page === currentPage}
                className={
                  page === currentPage
                    ? "border-blue-500 bg-blue-600 text-white hover:bg-blue-600"
                    : "border-transparent text-gray-300 hover:bg-white/10 hover:text-white"
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
            aria-disabled={currentPage === totalPages}
            className={
              currentPage === totalPages
                ? "pointer-events-none opacity-40"
                : "text-white hover:bg-white/10 hover:text-white"
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
