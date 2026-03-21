import type { Metadata } from 'next';
import { NutritionBlueprintView } from '@/views/athlete/NutritionBlueprintView';

export const metadata: Metadata = { title: 'Nutrition Blueprint' };

export default function Page(): React.ReactElement {
  return <NutritionBlueprintView />;
}
