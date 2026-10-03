import { useLocalSearchParams } from 'expo-router';
import { RunDetailContent } from '../../dark-factory/RunDetailContent';

export const options = { title: 'Run Detail' };

export default function RunDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <RunDetailContent id={id} />;
}
