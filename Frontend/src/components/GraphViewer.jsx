import React, { useRef, useEffect, useState } from "react";
import ForceGraph2D from "react-force-graph-2d";

const GraphViewer = ({ graphData }) => {
  const fgRef = useRef();
  const [hoverNode, setHoverNode] = useState(null);

  // Compute node degrees for size scaling
  useEffect(() => {
    if (graphData) {
      const degreeMap = {};
      graphData.links.forEach(({ source, target }) => {
        degreeMap[source] = (degreeMap[source] || 0) + 1;
        degreeMap[target] = (degreeMap[target] || 0) + 1;
      });
      graphData.nodes.forEach((node) => {
        node.val = degreeMap[node.id] || 1; // node size
      });
    }
  }, [graphData]);

  return (
    <div className="w-full h-[600px] border rounded bg-white shadow-md">
      <ForceGraph2D
        ref={fgRef}
        graphData={graphData}
        nodeAutoColorBy="id"
        nodeLabel={(node) => `Node ${node.id}`}
        linkDirectionalParticles={(link) =>
          hoverNode &&
          (link.source.id === hoverNode.id || link.target.id === hoverNode.id)
            ? 4
            : 0
        }
        linkDirectionalParticleWidth={2}
        nodeCanvasObject={(node, ctx, globalScale) => {
          const label = node.id;
          const fontSize = 12 / globalScale;
          ctx.font = `${fontSize}px Sans-Serif`;
          const textWidth = ctx.measureText(label).width;
          const bckgDimensions = [textWidth, fontSize].map((n) => n + 2);

          ctx.fillStyle = node.color || "rgba(0,0,255,0.3)";
          ctx.beginPath();
          ctx.arc(
            node.x,
            node.y,
            Math.sqrt(node.val) * 4,
            0,
            2 * Math.PI,
            false
          );
          ctx.fill();

          if (globalScale > 1.5) {
            ctx.fillStyle = "rgba(255,255,255,0.8)";
            ctx.fillRect(
              node.x - bckgDimensions[0] / 2,
              node.y - bckgDimensions[1] / 2,
              ...bckgDimensions
            );
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillStyle = "black";
            ctx.fillText(label, node.x, node.y);
          }
        }}
        onNodeHover={(node) => setHoverNode(node)}
        linkColor={() => "rgba(0,0,0,0.2)"}
        cooldownTicks={100}
        onEngineStop={() => fgRef.current.zoomToFit(400)}
      />
    </div>
  );
};

export default GraphViewer;
