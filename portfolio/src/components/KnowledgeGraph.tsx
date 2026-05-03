"use client";

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface Node extends d3.SimulationNodeDatum {
  id: string;
  label: string;
  group: number; // 1: Source (Cyan), 2: Processing (White), 3: History (Gray)
  val: number;
}

interface Link extends d3.SimulationLinkDatum<Node> {
  source: string | Node;
  target: string | Node;
  value: number;
}

const DATA: { nodes: Node[]; links: Link[] } = {
  nodes: [
    // Cluster 1: Ingestion
    { id: "ingestion_hub", label: "High-Fidelity Schema", group: 1, val: 24 },
    { id: "signal", label: "Signal Extraction", group: 1, val: 12 },
    { id: "cache", label: "Distributed Cache", group: 1, val: 12 },
    { id: "guardrail", label: "Guardrail", group: 1, val: 12 },

    // Cluster 2: Agentic
    { id: "agentic_hub", label: "Autonomous Agentic Loop", group: 2, val: 24 },
    { id: "audit", label: "Iterative State Audit", group: 2, val: 12 },
    { id: "memory", label: "Contextual Memory Layer", group: 2, val: 12 },

    // Cluster 3: Infrastructure
    { id: "infra_hub", label: "Low-Latency Inference Engine", group: 2, val: 24 },
    { id: "proxy", label: "Edge-Hardened Proxy", group: 2, val: 12 },
    { id: "api", label: "Stateless API", group: 2, val: 12 },

    // Tactical Support Nodes (Formerly noise)
    { id: "stream", label: "Raw Data Stream", group: 1, val: 12 },
    { id: "persistence", label: "State Persistence", group: 2, val: 12 },
    { id: "predictor", label: "Token Predictor", group: 2, val: 12 },
    { id: "telemetry", label: "System Telemetry", group: 2, val: 12 },
  ],
  links: [
    // Ingestion Links
    { source: "ingestion_hub", target: "signal", value: 3 },
    { source: "ingestion_hub", target: "cache", value: 3 },
    { source: "ingestion_hub", target: "guardrail", value: 3 },
    { source: "ingestion_hub", target: "stream", value: 3 },

    // Agentic Links
    { source: "agentic_hub", target: "audit", value: 3 },
    { source: "agentic_hub", target: "memory", value: 3 },
    { source: "agentic_hub", target: "persistence", value: 3 },

    // Infra Links
    { source: "infra_hub", target: "proxy", value: 3 },
    { source: "infra_hub", target: "api", value: 3 },
    { source: "infra_hub", target: "predictor", value: 3 },
    { source: "infra_hub", target: "telemetry", value: 3 },

    // Cross-hub bridge
    { source: "ingestion_hub", target: "agentic_hub", value: 1 },
    { source: "agentic_hub", target: "infra_hub", value: 1 },
  ]
};




export default function KnowledgeGraph() {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    svg.attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height] as any);

    const defs = svg.append("defs");
    const filter = defs.append("filter").attr("id", "glow");
    filter.append("feGaussianBlur").attr("stdDeviation", "1.5").attr("result", "coloredBlur");
    const feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "coloredBlur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

    const g = svg.append("g")
      .attr("class", "main-wrapper")
      .attr("transform", `translate(${width * 0.22}, ${height * 0.18}) scale(0.6)`);



    // Simulation recalibrated for fixed plane
    const simulation = d3.forceSimulation<Node>(DATA.nodes)
      .force("link", d3.forceLink<Node, Link>(DATA.links).id(d => d.id).distance(90))
      .force("charge", d3.forceManyBody().strength(-600))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(45));

    const link = g.append("g")
      .selectAll("line")
      .data(DATA.links)
      .join("line")
      .attr("stroke", "rgba(255, 255, 255, 0.2)")
      .attr("stroke-width", 4)
      .attr("stroke-opacity", 0.6);

    const node = g.append("g")
      .selectAll<SVGGElement, Node>("g")
      .data(DATA.nodes)
      .join("g")
      .attr("class", "node-group")
      .call(drag(simulation) as any);

    node.append("circle")
      .attr("r", d => d.val)
      .attr("fill", d => {
        if (d.val > 15) return "#a855f7"; // Hub
        return "#3b82f6"; // Sub-nodes
      })
      .attr("filter", "url(#glow)")
      .attr("opacity", 1);


    const labels = node.append("text")
      .text(d => d.label)
      .attr("x", d => d.val > 15 ? 32 : 24)
      .attr("y", 6)
      .attr("fill", "#fff")
      .attr("font-family", "JetBrains Mono, monospace")
      .attr("font-size", d => d.val > 15 ? "20px" : "13px")
      .attr("font-weight", d => d.val > 15 ? "bold" : "normal")
      .attr("pointer-events", "none")
      .attr("opacity", 0.8);



    node.on("mouseover", (event, d) => {
      const neighbors = new Set();
      DATA.links.forEach((l: any) => {
        if (l.source.id === d.id) neighbors.add(l.target.id);
        if (l.target.id === d.id) neighbors.add(l.source.id);
      });

      node.transition().duration(200)
        .style("opacity", (n: any) => (n.id === d.id || neighbors.has(n.id)) ? 1 : 0.1);

      link.transition().duration(200)
        .style("stroke-opacity", (l: any) => (l.source.id === d.id || l.target.id === d.id) ? 1 : 0.05)
        .style("stroke", (l: any) => (l.source.id === d.id || l.target.id === d.id) ? "#a855f7" : "rgba(255,255,255,0.1)");
    })
      .on("mouseout", () => {
        node.transition().duration(200).style("opacity", 1);
        link.transition().duration(200)
          .style("stroke-opacity", 0.6)
          .style("stroke", "rgba(255, 255, 255, 0.2)");
      });

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node.attr("transform", d => `translate(${d.x},${d.y})`);
    });

    function drag(sim: d3.Simulation<Node, undefined>) {
      function dragstarted(event: any) {
        if (!event.active) sim.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      }
      function dragged(event: any) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }
      function dragended(event: any) {
        if (!event.active) sim.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      }
      return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
    }
    return () => { simulation.stop(); };
  }, [containerRef]);

  return (
    <div ref={containerRef} className="w-full h-full cursor-default overflow-hidden">
      <svg ref={svgRef} className="w-full h-full" />
    </div>
  );
}
