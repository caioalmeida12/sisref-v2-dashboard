import React, { useState, forwardRef } from "react";
import * as Tooltip from "@radix-ui/react-tooltip";

interface CustomTooltipWrapperProps {
  elementoTrigger: React.ReactNode;
  elementoContent: React.ReactNode;
  defaultOpen?: boolean;
}

export const CustomTooltipWrapper = forwardRef<
  HTMLDivElement,
  CustomTooltipWrapperProps
>(({ elementoContent, elementoTrigger, defaultOpen }, ref) => {
  const [aberto, setAberto] = useState(defaultOpen ?? false);

  const handleAbrirTooltip = () => setAberto(true);
  const handleFecharTooltip = () => setAberto(false);

  return (
    <Tooltip.Provider delayDuration={100}>
      <Tooltip.Root open={aberto} defaultOpen={true}>
        <Tooltip.Trigger
          asChild
          onMouseEnter={handleAbrirTooltip}
          onFocus={handleAbrirTooltip}
          onMouseLeave={handleFecharTooltip}
          onBlur={handleFecharTooltip}
        >
          <div ref={ref}>{elementoTrigger}</div>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className="max-w-[calc(100vw-2rem)] select-none rounded-[4px] border border-cinza-600 bg-branco-400 px-[15px] py-[10px] text-[15px] leading-none shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] will-change-[transform,opacity] data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade"
            sideOffset={5}
          >
            {elementoContent}
            <Tooltip.Arrow className="fill-branco-400" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
});

CustomTooltipWrapper.displayName = "CustomTooltipWrapper";
