import type { Concept } from '../types';

export const computerGraphics: Concept = {
  id: 'computer-graphics',
  unitId: 'ch4',
  number: '4.6.2',
  title: 'Computer Graphics',
  blurb: 'Rendering, animation, and 3D rotation all reduce to chained linear transformations and changes of basis.',
  tier: 'full',
  isApplication: true,

  learn: {
    overview: `
Modern computer graphics is built on linear algebra. Every object in a 3D scene has its own local coordinate frame; rendering the scene to a 2D screen involves a sequence of [[change-of-basis|changes of basis]] and [[matrix-representations|linear transformations]]: object frame → world frame → camera frame → screen.

Each step is a linear (or affine, with [[robotic-kinematics|homogeneous coordinates]]) transformation:

- **Modeling transformation**: position objects in the world by translating, rotating, scaling. Represented by a $4 \\times 4$ matrix.
- **View transformation**: transform from world coordinates into the camera's frame, where the camera sits at the origin looking down the $-z$ axis.
- **Projection transformation**: project from 3D into a normalized device coordinate system (NDC). Perspective projection is implemented as a homogeneous-coordinate matrix that does the perspective divide.
- **Viewport transformation**: scale NDC to pixel coordinates on the screen.

Composing these gives a single $4 \\times 4$ matrix that converts each vertex from object coordinates to screen pixels. This composition is the *graphics pipeline*, and it is implemented in hardware on every GPU as repeated matrix multiplications.

Animation works by varying these matrices over time. Key-frame animation interpolates between two transformation matrices (often using quaternions for smooth rotation). Skeletal animation associates each vertex with a weighted blend of transformation matrices from multiple bones, each contributing a [[similarity|similar transformation]] in its own bone-local frame.

The deeper observation: graphics works because every operation that happens to vertices on screen is a linear transformation of some kind, composed with other linear transformations. The mathematical theory of [[matrix-representations|matrix representations]] and [[change-of-basis|change of basis]] is precisely the theory of how a vertex moves through the rendering pipeline.
    `.trim(),

    definitions: [
      {
        term: 'Graphics pipeline',
        body: 'The sequence of transformations that converts 3D vertex coordinates into 2D screen pixels: model → world → view → projection → viewport.',
      },
      {
        term: 'Perspective projection',
        body: 'A homogeneous-coordinate transformation that projects 3D points onto a 2D image plane, accounting for the foreshortening that closer objects look bigger than distant ones.',
      },
    ],
    theorems: [],
  },

  explore: {
    vizComponent: null,
    description: 'No interactive visualization for this application.',
    misconception: {
      title: '',
      body: '',
    },
  },

  practice: {
    workedExample: [],
    problems: [],
  },
};
