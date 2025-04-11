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
      name: 'Vegan',
      description: 'Excludes all animal products.',
    },
    {
      name: 'Gluten-Free',
      description: 'Free from gluten.',
    },
    {
      name: 'Dairy-Free',
      description: 'Free from dairy products.',
    },
    {
      name: 'Nut-Free',
      description: 'Free from nuts.',
    },
    {
      name: 'Soy-Free',
      description: 'Free from soy products.',
    },
    {
      name: 'Pescatarian',
      description: 'Includes fish but excludes other meats.',
    },
    {
      name: 'Paleo',
      description: 'Excludes grains, legumes, and processed foods.',
    },
  ];
}

