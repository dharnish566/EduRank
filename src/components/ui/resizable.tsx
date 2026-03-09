// "use client";

// import * as React from "react";
// import { GripVerticalIcon } from "lucide-react";

// import {
//   PanelGroup,
//   Panel,
//   PanelResizeHandle,
// } from "react-resizable-panels";

// import { cn } from "../../lib/utils";

// type ResizablePanelGroupProps = React.ComponentProps<typeof PanelGroup>;

// function ResizablePanelGroup({
//   className,
//   ...props
// }: ResizablePanelGroupProps) {
//   return (
//     <PanelGroup
//       className={cn(
//         "flex h-full w-full data-[panel-group-direction=vertical]:flex-col",
//         className
//       )}
//       {...props}
//     />
//   );
// }

// type ResizablePanelProps = React.ComponentProps<typeof Panel>;

// function ResizablePanel(props: ResizablePanelProps) {
//   return <Panel {...props} />;
// }

// type ResizableHandleProps = React.ComponentProps<typeof PanelResizeHandle> & {
//   withHandle?: boolean;
// };

// function ResizableHandle({
//   withHandle,
//   className,
//   ...props
// }: ResizableHandleProps) {
//   return (
//     <PanelResizeHandle
//       className={cn(
//         "bg-border relative flex w-px items-center justify-center",
//         "data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full",
//         className
//       )}
//       {...props}
//     >
//       {withHandle && (
//         <div className="bg-border z-10 flex h-4 w-3 items-center justify-center rounded-xs border">
//           <GripVerticalIcon className="size-2.5" />
//         </div>
//       )}
//     </PanelResizeHandle>
//   );
// }

// export { ResizablePanelGroup, ResizablePanel, ResizableHandle };