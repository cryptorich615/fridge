/**
 * Represents a dietary restriction.
 */
export interface DietaryRestriction {
  /**
   * The name of the dietary restriction (e.g., Vegetarian, Gluten-Free).
   */
  name: string;
  /**
   * A description of the dietary restriction.
   */
  description: string;
}

/**
 * Asynchronously retrieves a list of supported dietary restrictions.
 *
 * @returns A promise that resolves to an array of DietaryRestriction objects.
 */
export async function getDietaryRestrictions(): Promise<DietaryRestriction[]> {
  // TODO: Implement this by calling an API.

  return [
    {
      name: 'Vegetarian',
      description: 'Suitable for vegetarians.',
    },
    {
      name: 'Gluten-Free',
      description: 'Free from gluten.',
    },
  ];
}
