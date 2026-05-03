import type { Concept } from '../types';

export const roboticKinematics: Concept = {
  id: 'robotic-kinematics',
  unitId: 'ch4',
  number: '4.6.1',
  title: 'Robotic Kinematics',
  blurb: 'Robotic arms compose linear transformations across joint frames — a sequence of changes of basis.',
  tier: 'full',
  isApplication: true,

  learn: {
    overview: `
A robotic arm is a chain of rigid links connected by joints. Each joint introduces its own local coordinate frame, and the position of the end effector — the gripper or tool at the end of the arm — depends on how all these frames combine. Computing the end effector's position from the joint angles is the **forward kinematics problem**, and it reduces to a sequence of [[change-of-basis|changes of basis]].

Each joint contributes a transformation matrix that converts coordinates from the next link's frame to the current link's frame. For revolute joints (rotational), this is a rotation matrix combined with a translation; for prismatic joints (sliding), it is a pure translation. To handle translations within the matrix framework, robotics uses **homogeneous coordinates** — embedding 3D space into $\\mathbb{R}^4$ so that translations become $4 \\times 4$ matrices.

The forward kinematics computation: chain the joint transformations from base to end effector. If $T_i$ is the transformation from frame $i+1$ to frame $i$, the end effector's position in the base frame is $T_1 T_2 \\cdots T_n \\cdot v$, where $v$ is the position in the end-effector's frame (often just the origin). This product of matrices is a sequence of changes of basis stacked on top of each other.

The inverse kinematics problem — given a desired end effector position, find the joint angles that achieve it — is much harder. It involves solving nonlinear equations and often has multiple solutions or none. But it builds directly on the linear-algebra setup: at each step, the linearization of the kinematics is a [[matrix-representations|matrix representation]] of the relationship between joint changes and end-effector motion, called the **Jacobian**. Inverting the Jacobian (or pseudo-inverting it for non-square cases) is how robotic controllers solve for the required joint motions.
    `.trim(),

    definitions: [
      {
        term: 'Forward kinematics',
        body: 'The problem of computing the end-effector position from the joint angles of a robotic arm. Reduces to multiplying a chain of joint transformation matrices.',
      },
      {
        term: 'Homogeneous coordinates',
        body: 'A coordinate convention in which 3D points are represented as 4D vectors of the form $(x, y, z, 1)^T$, allowing translations to be encoded as $4 \\times 4$ matrices alongside rotations.',
      },
      {
        term: 'Jacobian',
        body: 'The matrix of partial derivatives relating small changes in joint angles to small changes in end-effector position. Used in inverse kinematics and motion control.',
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
