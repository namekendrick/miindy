/**
 * Gets columns that can be dragged in the header
 * @param {Array} headers - Header objects from TanStack table
 * @param {string} textAttributeId - ID of the text attribute
 * @returns {Array} - Draggable columns
 */
export const getDraggableColumns = (headers, textAttributeId) => {
  if (!headers?.length) return [];

  return headers.filter(
    (header) =>
      !header.id.includes("select") &&
      !header.id.includes("add-column") &&
      header.id !== textAttributeId,
  );
};

/**
 * Reorders columns after a drag operation
 * @param {Array} visibleColumns - Current visible columns
 * @param {string} activeId - ID of the column being dragged
 * @param {string} overId - ID of the column being dropped on
 * @returns {Array|null} - Reordered columns or null if invalid operation
 */
export const reorderColumns = (visibleColumns, activeId, overId) => {
  if (!visibleColumns?.length || activeId === overId) return null;

  const sortedColumns = [...visibleColumns].sort(
    (a, b) => parseInt(a.position) - parseInt(b.position),
  );

  const fromIndex = sortedColumns.findIndex((col) => col.id === activeId);
  const toIndex = sortedColumns.findIndex((col) => col.id === overId);

  if (fromIndex === -1 || toIndex === -1) return null;

  const newArrangement = [...sortedColumns];
  const [movedItem] = newArrangement.splice(fromIndex, 1);
  newArrangement.splice(toIndex, 0, movedItem);

  const updatedColumns = newArrangement.map((col, index) => ({
    ...col,
    position: String(index),
  }));

  return updatedColumns;
};
