export type CaricaturePriceInput = {
  finishBase: number;
  typeAddition: number;
  people: number;
  pets: number;
  commercialUsage: boolean;
};

export function calculateCaricatureEstimate(input: CaricaturePriceInput): number {
  const values = [input.finishBase, input.typeAddition, input.people, input.pets];
  if (values.some(value => !Number.isFinite(value) || value < 0)) throw new Error('Invalid caricature price input.');
  const extraPeople = Math.max(0, Math.floor(input.people) - 1) * 650;
  const extraPets = Math.max(0, Math.floor(input.pets) - (input.people === 0 ? 1 : 0)) * 450;
  return input.finishBase + input.typeAddition + extraPeople + extraPets + (input.commercialUsage ? 1500 : 0);
}
