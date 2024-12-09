import React, { useEffect, useRef } from "react";

interface ClickOutsideProps {
  onClickOutside: () => void;
  children: React.ReactNode;
}

const ClickOutside: React.FC<ClickOutsideProps> = ({ onClickOutside, children }) => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        onClickOutside();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClickOutside]);

  return <div ref={wrapperRef}>{children}</div>;
};

export default ClickOutside;
