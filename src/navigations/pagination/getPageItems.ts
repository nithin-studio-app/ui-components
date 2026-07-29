export type PageItem = number | "ellipsis";

/** Page numbers to render, collapsing the middle behind an "ellipsis" once
 * there are more pages than fit — always keeps `boundaryCount` pages at
 * each end and `siblingCount` pages around the current one. */
export function getPageItems(count: number, page: number, siblingCount = 1, boundaryCount = 1): PageItem[] {
  const maxWithoutCollapsing = siblingCount * 2 + boundaryCount * 2 + 3;
  if (count <= maxWithoutCollapsing) {
    return Array.from({ length: count }, (_, i) => i + 1);
  }

  const leftBoundary = Array.from({ length: boundaryCount }, (_, i) => i + 1);
  const rightBoundary = Array.from({ length: boundaryCount }, (_, i) => count - boundaryCount + 1 + i);

  const siblingStart = Math.max(page - siblingCount, boundaryCount + 2);
  const siblingEnd = Math.min(page + siblingCount, count - boundaryCount - 1);

  const items: PageItem[] = [...leftBoundary];
  items.push(siblingStart > boundaryCount + 2 ? "ellipsis" : boundaryCount + 1);
  for (let i = siblingStart; i <= siblingEnd; i++) items.push(i);
  items.push(siblingEnd < count - boundaryCount - 1 ? "ellipsis" : count - boundaryCount);
  items.push(...rightBoundary);

  return items.filter((item, index, arr) => item !== "ellipsis" || arr[index - 1] !== "ellipsis");
}
