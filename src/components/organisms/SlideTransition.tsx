import React, { useEffect } from "react";
import { TransitionGroup, CSSTransition } from "react-transition-group";

interface SlideTransitionProps {
  progress: number,
  direction: "next" | "prev" | "fade",
  children: React.ReactNode,
  className?: string
}

const SlideTransition = ({
  progress,
  direction,
  children,
  className
}: SlideTransitionProps) => {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [progress]);

  return (
    <TransitionGroup
      className="h-full"
      childFactory={(child) => {
        return React.cloneElement(child, {
          classNames: `slide-${direction}`,
        });
      }}
    >
      <CSSTransition
        key={progress}
        timeout={300}
        classNames={`slide-${direction}`}
      >
        <div className={`w-full overflow-x-clip ${className}`}>
          {children}
        </div>
      </CSSTransition>
    </TransitionGroup>
  );
};

export default SlideTransition;