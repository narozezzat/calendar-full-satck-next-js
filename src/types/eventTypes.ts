/**
 * Interface for EventCard component props
 */
export interface EventCardProps {
  id: string;
  isActive: boolean;
  name: string;
  description: string | null;
  durationInMinutes: number;
  clerkUserId: string;
}
