import { useAutoTrackVisits } from '@/hooks/useAutoTrackVisits';

interface VisitTrackerProps {
  children: React.ReactNode;
}

const VisitTracker: React.FC<VisitTrackerProps> = ({ children }) => {
  useAutoTrackVisits();
  
  return <>{children}</>;
};

export default VisitTracker; 