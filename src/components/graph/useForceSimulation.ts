import { useRef, useEffect, useCallback, useState } from 'react';
import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceCenter,
  forceCollide,
  forceX,
  forceY,
  type Simulation,
  type SimulationNodeDatum,
  type SimulationLinkDatum,
} from 'd3-force';
import type { EdgeSource, UnitId } from '../../content/types';

export interface SimNode extends SimulationNodeDatum {
  id: string;
  unitId: UnitId;
  isUnit?: boolean;
  isApplication?: boolean;
  isNote?: boolean;
  radius: number;
  fx?: number | null;
  fy?: number | null;
}

export interface SimLink extends SimulationLinkDatum<SimNode> {
  source: string | SimNode;
  target: string | SimNode;
  type: string;
  edgeSource?: EdgeSource;
}

interface UseForceSimulationOptions {
  nodes: SimNode[];
  links: SimLink[];
  width: number;
  height: number;
  unitCentroids?: Record<UnitId, { x: number; y: number }>;
  clusterStrength?: number;
}

export function useForceSimulation({
  nodes,
  links,
  width,
  height,
  unitCentroids,
  clusterStrength = 0.3,
}: UseForceSimulationOptions) {
  const simRef = useRef<Simulation<SimNode, SimLink> | null>(null);
  const [positions, setPositions] = useState<
    Map<string, { x: number; y: number }>
  >(new Map());
  const nodesRef = useRef<SimNode[]>([]);
  const linksRef = useRef<SimLink[]>([]);

  useEffect(() => {
    if (width === 0 || height === 0) return;

    const existingPositions = new Map<string, { x: number; y: number }>();
    nodesRef.current.forEach((n) => {
      if (n.x != null && n.y != null) {
        existingPositions.set(n.id, { x: n.x, y: n.y });
      }
    });

    const simNodes: SimNode[] = nodes.map((n) => {
      const existing = existingPositions.get(n.id);
      return {
        ...n,
        x: n.fx ?? existing?.x ?? width / 2 + (Math.random() - 0.5) * width * 0.6,
        y: n.fy ?? existing?.y ?? height / 2 + (Math.random() - 0.5) * height * 0.6,
      };
    });

    const simLinks: SimLink[] = links.map((l) => ({ ...l }));

    nodesRef.current = simNodes;
    linksRef.current = simLinks;

    const linkDistance = (d: SimLink) => {
      const t = typeof d.type === 'string' ? d.type : 'related';
      if (t === 'prereq') return 80;
      if (t === 'generalizes') return 100;
      if (t === 'applies-to') return 120;
      if (t === 'dual-of') return 90;
      return 140;
    };

    const sim = forceSimulation<SimNode>(simNodes)
      .force(
        'link',
        forceLink<SimNode, SimLink>(simLinks)
          .id((d) => d.id)
          .distance(linkDistance)
          .strength(0.4)
      )
      .force('charge', forceManyBody<SimNode>().strength(-300).distanceMax(500))
      .force('center', forceCenter(width / 2, height / 2).strength(0.05))
      .force(
        'collide',
        forceCollide<SimNode>()
          .radius((d) => d.radius + 6)
          .strength(0.7)
      )
      .alphaDecay(0.02)
      .velocityDecay(0.3);

    if (unitCentroids) {
      sim.force(
        'clusterX',
        forceX<SimNode>()
          .x((d) => {
            if (d.isUnit) return width / 2;
            const c = unitCentroids[d.unitId];
            return c ? c.x : width / 2;
          })
          .strength((d) => (d.isUnit ? 0.01 : clusterStrength))
      );
      sim.force(
        'clusterY',
        forceY<SimNode>()
          .y((d) => {
            if (d.isUnit) return height / 2;
            const c = unitCentroids[d.unitId];
            return c ? c.y : height / 2;
          })
          .strength((d) => (d.isUnit ? 0.01 : clusterStrength))
      );
    }

    sim.on('tick', () => {
      const next = new Map<string, { x: number; y: number }>();
      simNodes.forEach((n) => {
        next.set(n.id, { x: n.x ?? 0, y: n.y ?? 0 });
      });
      setPositions(new Map(next));
    });

    simRef.current = sim;

    return () => {
      sim.stop();
      simRef.current = null;
    };
  }, [nodes, links, width, height, unitCentroids, clusterStrength]);

  const reheat = useCallback((alpha = 0.3) => {
    simRef.current?.alpha(alpha).restart();
  }, []);

  const pinNode = useCallback((id: string, x: number, y: number) => {
    const node = nodesRef.current.find((n) => n.id === id);
    if (node) {
      node.fx = x;
      node.fy = y;
    }
  }, []);

  const unpinNode = useCallback((id: string) => {
    const node = nodesRef.current.find((n) => n.id === id);
    if (node) {
      node.fx = null;
      node.fy = null;
      simRef.current?.alpha(0.1).restart();
    }
  }, []);

  const dragStart = useCallback((id: string) => {
    simRef.current?.alphaTarget(0.3).restart();
    const node = nodesRef.current.find((n) => n.id === id);
    if (node) {
      node.fx = node.x;
      node.fy = node.y;
    }
  }, []);

  const dragMove = useCallback((id: string, x: number, y: number) => {
    const node = nodesRef.current.find((n) => n.id === id);
    if (node) {
      node.fx = x;
      node.fy = y;
    }
  }, []);

  const dragEnd = useCallback((id: string, pin: boolean) => {
    simRef.current?.alphaTarget(0);
    if (!pin) {
      const node = nodesRef.current.find((n) => n.id === id);
      if (node) {
        node.fx = null;
        node.fy = null;
      }
    }
  }, []);

  return {
    positions,
    reheat,
    pinNode,
    unpinNode,
    dragStart,
    dragMove,
    dragEnd,
    simRef,
    nodesRef,
  };
}
