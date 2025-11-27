// src/types/svg.d.ts
declare module "*.svg?react" {
  import React = require("react");
  const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}