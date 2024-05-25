import { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

interface PortalProps {
  children: React.ReactNode;
  id: string;
  show: boolean;
}

export function Portal({ children, id, show }: PortalProps) {
  const targetRef = useRef<Element>();

  useEffect(() => {
    const element = document.querySelector(`#${id}`);
    if (element !== null) {
      targetRef.current = element;
    }
  }, [id]);

  return (targetRef.current && show) ? ReactDOM.createPortal(children, targetRef.current) : null;
}
