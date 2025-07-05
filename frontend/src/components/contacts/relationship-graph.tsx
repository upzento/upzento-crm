import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Card, CardHeader, CardContent } from '../ui/card';

interface Contact {
  id: string;
  name: string;
}

interface Relationship {
  id: string;
  contact1: Contact;
  contact2: Contact;
  type: string;
  strength?: number;
}

interface RelationshipGraphProps {
  relationships: Relationship[];
  onNodeClick?: (contactId: string) => void;
}

export const RelationshipGraph: React.FC<RelationshipGraphProps> = ({
  relationships,
  onNodeClick,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !relationships.length) return;

    // Extract unique contacts
    const contacts = new Set<Contact>();
    relationships.forEach(rel => {
      contacts.add(rel.contact1);
      contacts.add(rel.contact2);
    });

    const nodes = Array.from(contacts);
    const links = relationships.map(rel => ({
      source: nodes.findIndex(n => n.id === rel.contact1.id),
      target: nodes.findIndex(n => n.id === rel.contact2.id),
      type: rel.type,
      strength: rel.strength || 1,
    }));

    const width = 800;
    const height = 600;

    // Clear previous graph
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    // Create force simulation
    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id((d: any) => d.id))
      .force('charge', d3.forceManyBody().strength(-150))
      .force('center', d3.forceCenter(width / 2, height / 2));

    // Draw links
    const link = svg.append('g')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', d => Math.sqrt(d.strength));

    // Draw nodes
    const node = svg.append('g')
      .selectAll('circle')
      .data(nodes)
      .join('circle')
      .attr('r', 5)
      .attr('fill', '#69b3a2')
      .call(drag(simulation) as any);

    // Add labels
    const label = svg.append('g')
      .selectAll('text')
      .data(nodes)
      .join('text')
      .text(d => d.name)
      .attr('font-size', 12)
      .attr('dx', 8)
      .attr('dy', 3);

    // Add relationship type labels
    const linkLabel = svg.append('g')
      .selectAll('text')
      .data(links)
      .join('text')
      .text(d => d.type)
      .attr('font-size', 10)
      .attr('fill', '#666');

    // Update positions on simulation tick
    simulation.on('tick', () => {
      link
        .attr('x1', d => (d.source as any).x)
        .attr('y1', d => (d.source as any).y)
        .attr('x2', d => (d.target as any).x)
        .attr('y2', d => (d.target as any).y);

      node
        .attr('cx', d => (d as any).x)
        .attr('cy', d => (d as any).y);

      label
        .attr('x', d => (d as any).x)
        .attr('y', d => (d as any).y);

      linkLabel
        .attr('x', d => ((d.source as any).x + (d.target as any).x) / 2)
        .attr('y', d => ((d.source as any).y + (d.target as any).y) / 2);
    });

    // Add click handler
    if (onNodeClick) {
      node.on('click', (event, d) => onNodeClick((d as Contact).id));
    }

    // Cleanup
    return () => {
      simulation.stop();
    };
  }, [relationships, onNodeClick]);

  // Drag handler
  const drag = (simulation: d3.Simulation<any, undefined>) => {
    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return d3.drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended);
  };

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold">Contact Relationships</h3>
      </CardHeader>
      <CardContent>
        <svg ref={svgRef} className="w-full h-[600px]" />
      </CardContent>
    </Card>
  );
}; 