/**
 * Sorts columns by their position field
 * @param {Array} columns - Columns to sort
 * @returns {Array} - Sorted columns
 */
export const sortVisibleColumnsByPosition = (columns) => {
  if (!columns?.length) return [];

  return [...columns].sort(
    (a, b) => parseInt(a.position) - parseInt(b.position),
  );
};

/**
 * Filters attributes that are visible in the table
 * @param {Array} attributes - All attributes
 * @param {Array} visibleColumns - Columns that should be visible
 * @returns {Array} - Filtered attributes with relevant properties
 */
export const filterVisibleAttributes = (attributes, visibleColumns) => {
  if (!attributes?.length || !visibleColumns?.length) return [];

  const activeAttributes = attributes.filter((attr) => !attr.isArchived);

  const sortedVisibleColumns = sortVisibleColumnsByPosition(visibleColumns);

  const orderedAttributeIds = sortedVisibleColumns.map((col) => col.id);

  const visibleAttributes = orderedAttributeIds
    .map((id) => activeAttributes.find((attr) => attr.id === id))
    .filter(Boolean)
    .map((attr) => ({
      id: attr.id,
      name: attr.name,
      attributeType: attr.attributeType,
    }));

  return visibleAttributes;
};

/**
 * Creates initial filter group
 * @returns {Object} - Initial filter group
 */
export const createInitialFilterGroup = () => ({
  id: Date.now().toString(),
  type: "group",
  operator: "AND",
  rules: [],
});

/**
 * Extracts attributes from the first record
 * @param {Array} records - Records data
 * @returns {Array} - Attributes from the first record
 */
export const getAttributesFromFirstRecord = (records) => {
  if (!records?.[0]) return [];
  return records[0].object.attributes || [];
};

/**
 * Updates the view state with new filters
 * @param {Object} filters - New filters to apply
 * @param {Function} updateViewState - Function to update view state
 * @param {boolean} markAsChanged - Whether to mark the view as changed
 */
export const handleFilterChange = (
  filters,
  updateViewState,
  markAsChanged = true,
) => {
  updateViewState({
    filters,
    skipChangeTracking: !markAsChanged,
  });
};
