import type { Concept } from '../types';

export const complexEigenvalues: Concept = {
  id: 'complex-eigenvalues',
  unitId: 'ch8',
  number: '8.1',
  title: 'Complex Eigenvalues',
  blurb: 'Real matrices can have complex eigenvalues; their real form is rotation-plus-scaling, and their solutions are damped oscillations.',
  tier: 'full',

  learn: {
    overview: `
A real matrix can have complex eigenvalues. This is not an exotic edge case; it is the generic behavior of any [[linear-transformation-defs|linear transformation]] with rotational character. The matrix $\\begin{bmatrix} 0 & -1 \\\\ 1 & 0 \\end{bmatrix}$ rotates the plane by 90°, has no real invariant lines, and so cannot possibly have real [[eigenvectors|eigenvectors]]. Its eigenvalues are $\\pm i$.

When the characteristic polynomial of a real matrix has a complex root $\\lambda = \\alpha + i\\beta$, the complex conjugate $\\bar\\lambda = \\alpha - i\\beta$ is automatically also a root. Complex eigenvalues of real matrices always appear in conjugate pairs, and their eigenvectors are conjugates of each other. In the [[first-order-systems|dynamical-system]] interpretation $\\dot{\\mathbf{x}} = A\\mathbf{x}$, a complex eigenvalue pair $\\alpha \\pm i\\beta$ produces solutions of the form $e^{\\alpha t}\\cos(\\beta t)$ and $e^{\\alpha t}\\sin(\\beta t)$: an exponential envelope $e^{\\alpha t}$ modulated by an oscillation at frequency $\\beta$.

The geometric picture is the cleanest entry point. A real $2 \\times 2$ matrix with eigenvalues $\\alpha \\pm i\\beta$ is [[similarity|similar]] to its **real Jordan block** $\\begin{bmatrix} \\alpha & -\\beta \\\\ \\beta & \\alpha \\end{bmatrix}$. This block is exactly $\\alpha I$ (uniform scaling by $\\alpha$) plus $\\beta J$ where $J = \\begin{bmatrix} 0 & -1 \\\\ 1 & 0 \\end{bmatrix}$ rotates by 90°. So the action is "scale and rotate" — the matrix takes circles to circles in the appropriate basis, expanding (or shrinking) by $|\\alpha + i\\beta| = \\sqrt{\\alpha^2 + \\beta^2}$ per unit step while turning by $\\beta$ radians per unit time. In two real dimensions, there is no real eigenvector because no direction is preserved; everything rotates.

The [[matrix-exponentials|matrix exponential]] of this real Jordan block reveals why trigonometric functions appear in solutions. Since $J^2 = -I$, the Taylor series for $e^{\\beta J t}$ separates exactly the way the scalar Taylor series for $e^{i\\theta}$ separates into $\\cos\\theta + i\\sin\\theta$: even powers of $J$ collapse to $\\pm I$ and contribute $\\cos(\\beta t)$, odd powers collapse to $\\pm J$ and contribute $\\sin(\\beta t)$. Combined with the commuting scalar factor $e^{\\alpha t}$, the result is:
$$e^{At} = e^{\\alpha t}\\begin{bmatrix} \\cos(\\beta t) & -\\sin(\\beta t) \\\\ \\sin(\\beta t) & \\cos(\\beta t) \\end{bmatrix}.$$

This is the matrix version of Euler's formula. The sign of $\\alpha$ (the real part) controls long-term behavior: $\\alpha < 0$ gives **damped oscillations** that decay to zero (a mass-spring system with friction), $\\alpha > 0$ gives **growing oscillations** (instability, resonance), and $\\alpha = 0$ gives **pure oscillation** at constant amplitude (an undamped oscillator). The damped harmonic oscillator $m\\ddot x + c\\dot x + kx = 0$ produces complex eigenvalues with $\\alpha = -c/(2m)$ exactly when $c^2 < 4mk$ (the underdamped regime). The classification by behavior — overdamped, critically damped, underdamped — is a classification by eigenvalue type.

For [[basis-solutions|constructing the real solution basis]] when complex eigenvalues appear in an ODE system, the convention is to take real and imaginary parts of the complex solution $e^{\\lambda t}\\mathbf{v}$ rather than keeping a complex basis. If $\\mathbf{v} = \\mathbf{a} + i\\mathbf{b}$ is the complex eigenvector for $\\lambda = \\alpha + i\\beta$, then the two real basis solutions are $e^{\\alpha t}(\\cos(\\beta t)\\mathbf{a} - \\sin(\\beta t)\\mathbf{b})$ and $e^{\\alpha t}(\\sin(\\beta t)\\mathbf{a} + \\cos(\\beta t)\\mathbf{b})$. This is what the [[jordan-form|real Jordan form]] makes systematic: every complex pair gets replaced by its $2 \\times 2$ real rotation-scaling block.
    `.trim(),

    definitions: [
      {
        term: 'Complex eigenvalue',
        body: 'An eigenvalue $\\lambda = \\alpha + i\\beta$ of a matrix $A$ with $\\beta \\neq 0$. For a real matrix, complex eigenvalues come in conjugate pairs $\\alpha \\pm i\\beta$.',
      },
      {
        term: 'Real Jordan block (complex pair)',
        body: 'For a conjugate pair $\\alpha \\pm i\\beta$, the $2 \\times 2$ real block $\\begin{bmatrix} \\alpha & -\\beta \\\\ \\beta & \\alpha \\end{bmatrix}$. This block is similar over the reals to $\\mathrm{diag}(\\alpha + i\\beta, \\alpha - i\\beta)$ over the complexes.',
      },
      {
        term: 'Underdamped, critically damped, overdamped',
        body: 'For a second-order system $m\\ddot x + c\\dot x + kx = 0$: underdamped when $c^2 < 4mk$ (complex eigenvalues, oscillation), critically damped when $c^2 = 4mk$ (repeated real eigenvalue), overdamped when $c^2 > 4mk$ (two distinct real eigenvalues).',
      },
      {
        term: 'Damped oscillation',
        body: 'A solution of the form $e^{\\alpha t}(C_1 \\cos(\\beta t) + C_2 \\sin(\\beta t))$ with $\\alpha < 0$. The amplitude envelope $e^{\\alpha t}$ decays exponentially while the inner oscillation continues at angular frequency $\\beta$.',
      },
    ],

    theorems: [
      {
        name: 'Conjugate pairs',
        statement: 'If $A$ is a real matrix and $\\lambda = \\alpha + i\\beta$ is an eigenvalue with eigenvector $\\mathbf{v}$, then $\\bar\\lambda = \\alpha - i\\beta$ is also an eigenvalue, with eigenvector $\\bar{\\mathbf{v}}$.',
        intuition: 'The characteristic polynomial $\\det(A - \\lambda I)$ has real coefficients when $A$ does. Complex roots of real polynomials always come in conjugate pairs because $\\overline{p(\\lambda)} = p(\\bar\\lambda)$ — taking conjugates of the polynomial equation flips the eigenvalue while leaving the entries of $A$ alone. Concretely, in $\\mathbb{R}^2$ there can be no real eigenvector for a true rotation because no line is preserved; the complex eigenvectors $\\mathbf{a} \\pm i\\mathbf{b}$ encode the rotation plane and the rotation direction.',
      },
      {
        name: 'Real solutions from complex eigenvalues',
        statement: 'For $\\dot{\\mathbf{x}} = A\\mathbf{x}$ with complex eigenvalue $\\lambda = \\alpha + i\\beta$ and eigenvector $\\mathbf{v} = \\mathbf{a} + i\\mathbf{b}$, two linearly independent real solutions are $\\mathbf{x}_1(t) = e^{\\alpha t}(\\cos(\\beta t)\\mathbf{a} - \\sin(\\beta t)\\mathbf{b})$ and $\\mathbf{x}_2(t) = e^{\\alpha t}(\\sin(\\beta t)\\mathbf{a} + \\cos(\\beta t)\\mathbf{b})$.',
        intuition: 'The complex solution $e^{\\lambda t}\\mathbf{v}$ encodes both real solutions at once, since its real and imaginary parts each satisfy the same real ODE. Taking real and imaginary parts is the right way to extract a real basis, because the conjugate solution $e^{\\bar\\lambda t}\\bar{\\mathbf{v}}$ gives no new information; it lives in the same real 2D subspace.',
      },
      {
        name: 'Matrix exponential of a real Jordan block',
        statement: 'For $A = \\begin{bmatrix} \\alpha & -\\beta \\\\ \\beta & \\alpha \\end{bmatrix}$, $e^{At} = e^{\\alpha t}\\begin{bmatrix} \\cos(\\beta t) & -\\sin(\\beta t) \\\\ \\sin(\\beta t) & \\cos(\\beta t) \\end{bmatrix}$.',
        intuition: 'Write $A = \\alpha I + \\beta J$ with $J = \\begin{bmatrix} 0 & -1 \\\\ 1 & 0 \\end{bmatrix}$. Since $\\alpha I$ and $\\beta J$ commute, $e^{At} = e^{\\alpha I t} e^{\\beta J t} = e^{\\alpha t} e^{\\beta J t}$. And $J^2 = -I$, so the Taylor series for $e^{\\beta J t}$ has the same even/odd structure as the series for $\\cos\\theta + i\\sin\\theta$, producing the rotation matrix. This is precisely the matrix incarnation of Euler\'s formula.',
      },
    ],

    keyFormulas: [
      'e^{\\alpha t}\\cos(\\beta t), \\quad e^{\\alpha t}\\sin(\\beta t)',
      '\\text{Real Jordan block: } \\begin{bmatrix} \\alpha & -\\beta \\\\ \\beta & \\alpha \\end{bmatrix}',
      'e^{At} = e^{\\alpha t}\\begin{bmatrix} \\cos(\\beta t) & -\\sin(\\beta t) \\\\ \\sin(\\beta t) & \\cos(\\beta t) \\end{bmatrix}',
      '|\\lambda|^2 = \\alpha^2 + \\beta^2',
      'm\\ddot x + c\\dot x + kx = 0 \\implies \\lambda = \\frac{-c \\pm \\sqrt{c^2 - 4mk}}{2m}',
    ],
  },

  explore: {
    vizComponent: 'ComplexEigenvalueViz',
    description: 'Place a complex eigenvalue $\\lambda = \\alpha + i\\beta$ in the complex plane by dragging. The right panel shows the resulting trajectory of $\\dot{\\mathbf{x}} = A\\mathbf{x}$ from a fixed initial condition, with the spiral tightening/loosening as $\\beta$ changes and the envelope growing/decaying as $\\alpha$ crosses zero. A toggle reveals the real Jordan block $\\begin{bmatrix} \\alpha & -\\beta \\\\ \\beta & \\alpha \\end{bmatrix}$ and its decomposition into $\\alpha I + \\beta J$.',
    misconception: {
      title: 'The complex eigenvector is not "imaginary nonsense" — its real and imaginary parts each have geometric meaning.',
      body: `Students often treat complex eigenvectors as a formal tool with no physical interpretation, then panic when asked for real solutions. The complex eigenvector $\\mathbf{v} = \\mathbf{a} + i\\mathbf{b}$ for $\\lambda = \\alpha + i\\beta$ encodes a real 2-dimensional invariant subspace: the plane spanned by the real vectors $\\mathbf{a}$ and $\\mathbf{b}$. Inside that plane, the matrix acts as scaling by $\\sqrt{\\alpha^2 + \\beta^2}$ combined with rotation by $\\arctan(\\beta/\\alpha)$ per unit time.

A second misconception is the belief that complex eigenvalues require complex initial conditions. They do not. The real solution basis $e^{\\alpha t}(\\cos(\\beta t)\\mathbf{a} - \\sin(\\beta t)\\mathbf{b})$ and $e^{\\alpha t}(\\sin(\\beta t)\\mathbf{a} + \\cos(\\beta t)\\mathbf{b})$ is fully real-valued and is exactly what you use to match real initial data. Writing the general solution as $C_1 e^{\\lambda t}\\mathbf{v} + C_2 e^{\\bar\\lambda t}\\bar{\\mathbf{v}}$ with complex $C_1, C_2$ is mathematically equivalent but requires you to impose $C_2 = \\bar{C_1}$ to enforce reality. The real basis bypasses this.

A third trap is conflating the magnitude $|\\lambda| = \\sqrt{\\alpha^2 + \\beta^2}$ with stability for continuous-time systems. For continuous-time $\\dot{\\mathbf{x}} = A\\mathbf{x}$, what controls decay vs growth is the **real part** $\\alpha$, not the magnitude. A complex eigenvalue with $\\alpha = -0.01$ and $\\beta = 1000$ has huge magnitude but still produces decaying oscillation. The magnitude controls long-term growth only for discrete-time iteration $\\mathbf{x}_{k+1} = A\\mathbf{x}_k$, which lives in [[iteration|Unit 9]]. Continuous vs discrete: real part for ODEs, magnitude for iteration.

A fourth issue: assuming the rotation frequency $\\beta$ equals the period of the observed oscillation. It does not — $\\beta$ is the angular frequency, so the period is $2\\pi/\\beta$. A mass-spring system with $\\beta = 2\\pi$ rad/s completes one full oscillation per second, not $2\\pi$ of them.`,
    },
  },

  practice: {
    workedExample: [
      {
        title: 'Step 1 — find the eigenvalues of the rotation-scaling matrix',
        body: 'Take $A = \\begin{bmatrix} 1 & -2 \\\\ 2 & 1 \\end{bmatrix}$. The characteristic polynomial is $\\det(A - \\lambda I) = (1 - \\lambda)^2 + 4 = \\lambda^2 - 2\\lambda + 5$. The quadratic formula gives $\\lambda = 1 \\pm 2i$, so $\\alpha = 1$ and $\\beta = 2$.',
      },
      {
        title: 'Step 2 — find a complex eigenvector for $\\lambda = 1 + 2i$',
        body: 'Solve $(A - (1+2i)I)\\mathbf{v} = \\mathbf{0}$: the matrix $\\begin{bmatrix} -2i & -2 \\\\ 2 & -2i \\end{bmatrix}$ has dependent rows (verify by multiplying row 1 by $i$). From $-2i v_1 - 2 v_2 = 0$, take $v_1 = 1$, $v_2 = -i$. So $\\mathbf{v} = \\begin{bmatrix} 1 \\\\ -i \\end{bmatrix} = \\begin{bmatrix} 1 \\\\ 0 \\end{bmatrix} + i\\begin{bmatrix} 0 \\\\ -1 \\end{bmatrix} = \\mathbf{a} + i\\mathbf{b}$.',
      },
      {
        title: 'Step 3 — extract the real solution basis',
        body: 'The two real basis solutions for $\\dot{\\mathbf{x}} = A\\mathbf{x}$ are $\\mathbf{x}_1(t) = e^{t}(\\cos(2t)\\mathbf{a} - \\sin(2t)\\mathbf{b}) = e^t\\begin{bmatrix} \\cos(2t) \\\\ \\sin(2t) \\end{bmatrix}$ and $\\mathbf{x}_2(t) = e^t(\\sin(2t)\\mathbf{a} + \\cos(2t)\\mathbf{b}) = e^t\\begin{bmatrix} \\sin(2t) \\\\ -\\cos(2t) \\end{bmatrix}$. Trajectories spiral outward (since $\\alpha = 1 > 0$) and complete one revolution every $\\pi$ seconds.',
      },
    ],

    problems: [
      {
        id: 'P-8.1a',
        format: 'multiple-choice' as const,
        difficulty: 1,
        statement: 'A damped harmonic oscillator is described by $m\\ddot x + c\\dot x + kx = 0$. Which eigenvalue pattern of the companion matrix corresponds to damped oscillations (decaying oscillatory motion)?',
        choices: [
          { label: 'A' as const, body: 'Two distinct real negative eigenvalues.' },
          { label: 'B' as const, body: 'Two complex conjugate eigenvalues with negative real part.' },
          { label: 'C' as const, body: 'A repeated real negative eigenvalue.' },
          { label: 'D' as const, body: 'Two distinct real positive eigenvalues.' },
          { label: 'E' as const, body: 'Two complex conjugate eigenvalues with positive real part.' },
        ],
        correctAnswer: 'B' as const,
        solution: {
          explanation: 'Oscillation requires a nonzero imaginary part $\\beta$ in the eigenvalue, since the trigonometric factor $\\cos(\\beta t)$ or $\\sin(\\beta t)$ comes from precisely that imaginary part. Decay requires a negative real part $\\alpha$, since the envelope $e^{\\alpha t}$ shrinks exactly when $\\alpha < 0$. Together: $\\lambda = \\alpha \\pm i\\beta$ with $\\alpha < 0$ and $\\beta \\neq 0$. This is the underdamped regime $c^2 < 4mk$.',
          trickAnalysis: [
            { choice: 'A' as const, why: 'Two distinct real negative eigenvalues give two pure exponential decays $e^{\\lambda_1 t}, e^{\\lambda_2 t}$ with no oscillation. This is the overdamped regime.' },
            { choice: 'C' as const, why: 'A repeated real negative eigenvalue gives solutions $e^{\\lambda t}, te^{\\lambda t}$ — still no oscillation. This is the critically damped regime.' },
            { choice: 'D' as const, why: 'Distinct real positive eigenvalues give growing exponentials, not damped oscillations. Wrong sign of real part and no oscillation.' },
            { choice: 'E' as const, why: 'Positive real part gives growing oscillations — exponentially amplifying motion, which is instability, not damping.' },
          ],
        },
      },
      {
        id: 'P-8.1b',
        format: 'multiple-choice' as const,
        difficulty: 2,
        statement: 'Consider the $2 \\times 2$ real Jordan block $A = \\begin{bmatrix} \\alpha & -\\beta \\\\ \\beta & \\alpha \\end{bmatrix} = \\alpha I + \\beta J$ where $J = \\begin{bmatrix} 0 & -1 \\\\ 1 & 0 \\end{bmatrix}$. The matrix exponential is $e^{At} = e^{\\alpha t}\\begin{bmatrix} \\cos(\\beta t) & -\\sin(\\beta t) \\\\ \\sin(\\beta t) & \\cos(\\beta t) \\end{bmatrix}$. Why do the trigonometric functions appear?',
        choices: [
          { label: 'A' as const, body: 'Complex eigenvalues always produce oscillatory behavior, which is represented by trigonometric functions.' },
          { label: 'B' as const, body: 'The skew-symmetric part $\\beta J$ satisfies $J^2 = -I$, so the Taylor series for $e^{\\beta J t}$ separates into even/odd terms that match the series for $\\cos(\\beta t)$ and $\\sin(\\beta t)$.' },
          { label: 'C' as const, body: 'The matrix $J$ represents a rotation, and rotations are always described by sines and cosines.' },
          { label: 'D' as const, body: "Euler's formula $e^{i\\beta t} = \\cos(\\beta t) + i\\sin(\\beta t)$ is directly applied to the matrix exponential." },
          { label: 'E' as const, body: 'The determinant of $A$ equals $\\alpha^2 + \\beta^2$, which forces the exponential to have magnitude 1, requiring trigonometric parameterization.' },
        ],
        correctAnswer: 'B' as const,
        solution: {
          explanation: 'The matrix exponential is defined by its power series $e^{At} = \\sum_{k=0}^\\infty \\frac{(At)^k}{k!}$. Since $\\alpha I$ commutes with $\\beta J$, $e^{At} = e^{\\alpha t} e^{\\beta J t}$. The key fact is $J^2 = -I$, so $J^3 = -J$, $J^4 = I$, and the powers cycle through $\\{I, J, -I, -J\\}$ with period 4. The Taylor series for $e^{\\beta J t}$ splits exactly as $(\\cos(\\beta t))I + (\\sin(\\beta t))J$ — the even-power terms collapse to $\\pm I$ and produce the cosine series, the odd-power terms collapse to $\\pm J$ and produce the sine series. This is the matrix incarnation of why $e^{i\\theta} = \\cos\\theta + i\\sin\\theta$: same algebra ($i^2 = -1$ vs $J^2 = -I$), same series separation.',
          partialCredit: 'D (recognizes the connection to Euler\'s formula but does not explain the mechanism — the formula is a scalar identity, and the question asks why it lifts to matrices, which requires the $J^2 = -I$ structure).',
          trickAnalysis: [
            { choice: 'A' as const, why: 'Identifies a true symptom (oscillation) but is circular — it asserts the conclusion as the reason. The question asks WHY trig appears, not THAT it appears.' },
            { choice: 'C' as const, why: 'Correct intuition (βJ is a rotation generator) but does not pinpoint the mechanism, which is the J² = -I structure separating the Taylor series.' },
            { choice: 'D' as const, why: "Euler's formula is a scalar identity. Lifting it to matrices requires the algebraic fact $J^2 = -I$, which makes $J$ behave like the imaginary unit. Without that observation, you cannot just 'apply' Euler's formula to a matrix." },
            { choice: 'E' as const, why: '$\\det(A) = \\alpha^2 + \\beta^2$ is correct but unrelated. Determinant constrains the product of eigenvalues, not the form of $e^{At}$.' },
          ],
        },
      },
      {
        id: 'P-8.1c',
        format: 'multiple-choice' as const,
        difficulty: 2,
        statement: 'The linear differential equation $\\frac{d^3 x}{dt^3} + a\\frac{d^2 x}{dt^2} + b\\frac{dx}{dt} + cx = 0$ has companion matrix with eigenvalues $\\lambda_1 = 2$ and $\\lambda_{2,3} = -1 \\pm 3i$. Which set is the most natural real basis for the solution space?',
        choices: [
          { label: 'A' as const, body: '$\\{e^{2t}, e^{(-1+3i)t}, e^{(-1-3i)t}\\}$' },
          { label: 'B' as const, body: '$\\{e^{2t}, e^{-t}\\cos(3t), e^{-t}\\sin(3t)\\}$' },
          { label: 'C' as const, body: '$\\{e^{2t}, te^{2t}, t^2 e^{2t}\\}$' },
          { label: 'D' as const, body: '$\\{e^{2t}, e^{-t}, \\cos(3t), \\sin(3t)\\}$' },
          { label: 'E' as const, body: '$\\{2e^{2t}, -e^{-t}, e^{-t}\\cos(3t), e^{-t}\\sin(3t)\\}$' },
        ],
        correctAnswer: 'B' as const,
        solution: {
          explanation: 'The solution space of a real third-order linear ODE is real and 3-dimensional. The real eigenvalue $\\lambda_1 = 2$ contributes $e^{2t}$. The complex pair $-1 \\pm 3i$ contributes a real 2-dimensional subspace, with real basis $e^{-t}\\cos(3t)$ and $e^{-t}\\sin(3t)$ (the real and imaginary parts of $e^{(-1+3i)t}$). So a natural real basis is $\\{e^{2t}, e^{-t}\\cos(3t), e^{-t}\\sin(3t)\\}$.',
          partialCredit: 'A (technically a valid complex basis, but the question asks for a real basis suited to a real ODE; complex exponentials require imposing conjugate-pair constraints on coefficients to extract real solutions).',
          trickAnalysis: [
            { choice: 'A' as const, why: 'These are correct complex basis solutions but require conjugate-pair constraints on coefficients to give real-valued solutions. The real basis bypasses this.' },
            { choice: 'C' as const, why: 'This basis is wrong for the given eigenvalues — it corresponds to a repeated eigenvalue $\\lambda = 2$ with algebraic multiplicity 3, not the distinct $\\lambda_1 = 2$ plus complex pair.' },
            { choice: 'D' as const, why: 'Separating the $e^{-t}$ envelope from the $\\cos(3t), \\sin(3t)$ oscillation produces 4 functions, exceeding the 3-dimensional solution space. The envelope and trig MUST be multiplied together.' },
            { choice: 'E' as const, why: 'The leading coefficients ($2e^{2t}$, $-e^{-t}$) are spurious — they do not change the span but obscure the structure. Also includes the same dimensionality error as (D).' },
          ],
        },
      },
      {
        id: 'P-8.1d',
        format: 'multiple-choice' as const,
        difficulty: 3,
        statement: 'Let $A$ be a real $2 \\times 2$ matrix with complex eigenvalues $\\lambda = \\alpha \\pm i\\beta$, $\\beta \\neq 0$. Which statement is FALSE?',
        choices: [
          { label: 'A' as const, body: '$A$ has no real eigenvectors.' },
          { label: 'B' as const, body: '$A$ is similar over $\\mathbb{R}$ to the real Jordan block $\\begin{bmatrix} \\alpha & -\\beta \\\\ \\beta & \\alpha \\end{bmatrix}$.' },
          { label: 'C' as const, body: '$\\det(A) = \\alpha^2 + \\beta^2 > 0$ and $\\mathrm{tr}(A) = 2\\alpha$.' },
          { label: 'D' as const, body: 'Solutions of $\\dot{\\mathbf{x}} = A\\mathbf{x}$ decay to zero if and only if $|\\lambda|^2 = \\alpha^2 + \\beta^2 < 1$.' },
          { label: 'E' as const, body: '$A$ has no real invariant 1-dimensional subspaces.' },
        ],
        correctAnswer: 'D' as const,
        solution: {
          explanation: 'For continuous-time $\\dot{\\mathbf{x}} = A\\mathbf{x}$, solutions decay if and only if $\\alpha < 0$ (negative real part). The magnitude condition $|\\lambda| < 1$ controls discrete-time iteration $\\mathbf{x}_{k+1} = A\\mathbf{x}_k$, a totally different criterion. The statement in (D) mixes the two: it states the discrete criterion ($|\\lambda| < 1$) for a continuous-time system. (A), (B), (C), (E) are all true: no real eigenvectors because rotation preserves no line; the real Jordan block is the canonical real form; determinant equals product of eigenvalues and trace equals sum; and no real invariant 1D subspaces is the geometric restatement of no real eigenvectors.',
          trickAnalysis: [
            { choice: 'A' as const, why: 'TRUE — a complex eigenvalue $\\alpha + i\\beta$ with $\\beta \\neq 0$ cannot have a real eigenvector, because $A\\mathbf{v} = (\\alpha + i\\beta)\\mathbf{v}$ for real $\\mathbf{v}$ would require the imaginary part to vanish.' },
            { choice: 'B' as const, why: 'TRUE — this is precisely the real Jordan form for a complex conjugate pair.' },
            { choice: 'C' as const, why: 'TRUE — for a $2 \\times 2$ matrix, $\\det A = \\lambda_1 \\lambda_2 = (\\alpha + i\\beta)(\\alpha - i\\beta) = \\alpha^2 + \\beta^2$ and $\\mathrm{tr}\\,A = \\lambda_1 + \\lambda_2 = 2\\alpha$.' },
            { choice: 'E' as const, why: 'TRUE — same geometric content as (A), restated. A real invariant 1D subspace IS a real eigenvector direction.' },
          ],
        },
      },
    ],
  },
};
