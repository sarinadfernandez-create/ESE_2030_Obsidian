import type { Concept } from '../types';

export const similarity: Concept = {
  id: 'similarity',
  unitId: 'ch4',
  number: '4.5',
  title: 'Similarity',
  blurb: 'When two matrices represent the same linear transformation in different bases.',
  tier: 'full',

  learn: {
    overview: `
Two square matrices $A$ and $B$ are **similar** if there exists an invertible matrix $P$ with $B = P^{-1} A P$. Geometrically, similarity captures exactly when two matrices represent the *same linear transformation* in different bases. The matrix $P$ is the [[change-of-basis|change-of-basis matrix]] connecting the two coordinate systems.

Similarity is the algebraic counterpart of the structural fact that a linear transformation is intrinsic, while its [[matrix-representations|matrix representation]] depends on a chosen basis. Pick a different basis, get a different matrix — but the same underlying transformation. The relation $B = P^{-1} A P$ is the precise statement of "$A$ and $B$ describe the same map."

The intuition: to apply $A$ in the new basis, convert to the old basis ($P$), apply $A$, then convert back ($P^{-1}$). This conjugation captures the basis change, and the result is the matrix that does the right thing in the new basis.

Similarity is an **equivalence relation**: every matrix is similar to itself ($P = I$), similarity is symmetric ($A = Q^{-1} B Q$ if $B = P^{-1} A P$, with $Q = P^{-1}$), and similarity is transitive (composing two changes of basis gives a change of basis). So matrices fall into **similarity classes**, each class consisting of all matrices representing the same transformation up to choice of basis.

A central theme: certain numerical quantities are **invariants** under similarity — they take the same value for similar matrices, regardless of which member of the similarity class you compute them on. The most important invariants:

- **Determinant**: $\\det(P^{-1} A P) = \\det(P)^{-1} \\det(A) \\det(P) = \\det(A)$.
- **Trace**: $\\text{tr}(P^{-1} A P) = \\text{tr}(A P P^{-1}) = \\text{tr}(A)$, using the cyclic property of trace.
- **Rank**: row reduction does not change rank, and similarity is a particular invertible transformation.
- **Nullity**: by [[rank-and-nullity|rank-nullity]], if rank is invariant so is nullity.
- **Eigenvalues**: $\\det(B - \\lambda I) = \\det(P^{-1} A P - \\lambda I) = \\det(P^{-1}(A - \\lambda I) P) = \\det(A - \\lambda I)$, so similar matrices have the same characteristic polynomial.

Things that are NOT preserved by similarity: individual matrix entries (in particular the $(i, j)$ entry), the row space, the column space, and most other "coordinate-attached" features. If a property depends on which basis you use, similarity will change it; if it is intrinsic to the transformation, similarity preserves it.

Similarity is what underwrites the entire theory of [[simple-diagonalization|diagonalization]]. A matrix is **diagonalizable** if it is similar to a diagonal matrix — that is, if there exists a basis (the basis of [[eigenvectors|eigenvectors]]) in which the matrix becomes diagonal. The diagonal entries are the eigenvalues, and the change-of-basis matrix $P$ has the eigenvectors as its columns. This is the ultimate "simplest representation" of a diagonalizable transformation.

The strategy of "choose the right basis to make the matrix simple" is the recurring theme of much of the rest of the course. [[lu-decomposition|LU]] makes a matrix triangular by row operations. [[qr-decomposition|QR]] uses an orthonormal basis to make the matrix orthogonal-times-triangular. [[svd-form|SVD]] uses two different bases to make it diagonal. [[jordan-form|Jordan canonical form]] handles non-diagonalizable matrices via similarity. All of these factorizations are similarity arguments at heart.
    `.trim(),

    definitions: [
      {
        term: 'Similar matrices',
        body: 'Square matrices $A$ and $B$ of the same size are similar if there exists an invertible matrix $P$ with $B = P^{-1} A P$. Written $A \\sim B$.',
      },
      {
        term: 'Similarity invariant',
        body: 'A property or quantity of a matrix that is the same for any two similar matrices. Examples: determinant, trace, rank, nullity, eigenvalues, characteristic polynomial.',
      },
      {
        term: 'Similarity class',
        body: 'For a square matrix $A$: the set of all matrices similar to $A$. Two matrices are in the same similarity class iff they represent the same linear transformation in some pair of bases.',
      },
    ],

    theorems: [
      {
        name: 'Similarity is an equivalence relation',
        statement: 'Similarity is reflexive, symmetric, and transitive on the set of square $n \\times n$ matrices.',
        intuition: 'The structure follows from properties of the change-of-basis matrix $P$. Reflexivity: $A = I^{-1} A I$. Symmetry: $A = (P^{-1})^{-1} B (P^{-1})$. Transitivity: composing two changes of basis gives a change of basis.',
      },
      {
        name: 'Similarity preserves determinant, trace, rank, and eigenvalues',
        statement: 'If $A \\sim B$, then $\\det(A) = \\det(B)$, $\\text{tr}(A) = \\text{tr}(B)$, $\\text{rank}(A) = \\text{rank}(B)$, and $A$ and $B$ have the same characteristic polynomial (and hence the same eigenvalues with multiplicities).',
        intuition: 'These quantities are intrinsic to the underlying linear transformation, not to the basis used to represent it. The proof for each uses a specific algebraic identity — most of which involve cyclic shifts inside a determinant or trace.',
      },
    ],

    keyFormulas: [
      'B = P^{-1} A P',
      '\\det(A) = \\det(B)',
      '\\text{tr}(A) = \\text{tr}(B)',
      '\\text{rank}(A) = \\text{rank}(B)',
    ],
  },

  explore: {
    vizComponent: 'SimilarityViz',
    description: 'Pick a $2 \\times 2$ matrix $A$ and a change-of-basis matrix $P$. The viz computes $B = P^{-1} A P$ and displays both $A$ and $B$ side by side, plus their shared invariants (determinant, trace, eigenvalues). Drag $P$ to deform — watch the matrix entries of $B$ change wildly while the invariants stay constant.',
    misconception: {
      title: 'Similarity preserves intrinsic properties, but generally does NOT preserve specific entries',
      body: `
A common error is treating similar matrices as "almost the same" — expecting individual entries to be similar (in the colloquial sense). They are not. Similar matrices can look completely different entry-by-entry.

The classic example: a rotation matrix $R = \\begin{pmatrix} \\cos\\theta & -\\sin\\theta \\\\ \\sin\\theta & \\cos\\theta \\end{pmatrix}$ is similar to the matrix obtained by changing to a basis aligned with the rotation axis (in 3D) — but in 2D where the eigenvalues are complex, the matrix in any basis still has trigonometric entries. Across bases, the entries can be utterly different even though the trace, determinant, and eigenvalues remain the same.

A specific question that students sometimes get wrong: "Two students compute $T$\'s matrix in two bases and get different matrices. One must have made a mistake." This is wrong. The correct response is that the matrix representation depends on the basis — different bases produce different (similar) matrices, all correctly representing the same transformation.

A second misconception: thinking that having "integer entries" is intrinsic. It is not. A matrix can have integer entries in one basis (the standard one, say) and irrational entries in another basis. The integer property is coordinate-dependent. (There is a partial exception: integer entries in the *standard* basis specifically does indicate that $T$ preserves the integer lattice $\\mathbb{Z}^n$, which IS intrinsic — but that observation is about the standard basis being special, not about integer entries being basis-free.)

A third trap: confusing similarity with equivalence under elementary row or column operations. Two matrices that are row-equivalent need not be similar. Row equivalence preserves the row space and the rank; similarity preserves the eigenvalues and the geometric structure of the underlying transformation. They are different equivalence relations.
      `.trim(),
    },
  },

  practice: {
    workedExample: [
      {
        title: 'Verify similarity preserves the trace',
        body: 'Let $A = \\begin{pmatrix} 1 & 2 \\\\ 0 & 3 \\end{pmatrix}$ and $P = \\begin{pmatrix} 1 & 1 \\\\ 1 & -1 \\end{pmatrix}$. Compute $B = P^{-1} A P$. We have $P^{-1} = \\frac{1}{-2} \\begin{pmatrix} -1 & -1 \\\\ -1 & 1 \\end{pmatrix} = \\frac{1}{2} \\begin{pmatrix} 1 & 1 \\\\ 1 & -1 \\end{pmatrix}$.',
      },
      {
        title: 'Compute and check invariants',
        body: 'Without doing the full computation: by the similarity theorem, $\\text{tr}(B) = \\text{tr}(A) = 1 + 3 = 4$ and $\\det(B) = \\det(A) = 3$. Even without computing $B$, we know its diagonal entries sum to $4$ and its determinant is $3$. The eigenvalues are also preserved: $\\lambda = 1$ and $\\lambda = 3$.',
      },
    ],

    problems: [
      {
        id: 'P-4.5a',
        format: 'multiple-choice' as const,
        difficulty: 1,
        statement: 'Let $T: \\mathbb{R}^3 \\to \\mathbb{R}^3$ be a linear transformation. Suppose in the standard basis $\\mathcal{E}$, the matrix representation is $[T]_\\mathcal{E}^\\mathcal{E} = A$. In a different basis $\\mathcal{B}$, the matrix representation is $[T]_\\mathcal{B}^\\mathcal{B} = B$. Which statement about the relationship between $A$ and $B$ is TRUE?',
        choices: [
          { label: 'A' as const, body: '$A = B$ since they represent the same transformation.' },
          { label: 'B' as const, body: '$A$ and $B$ are similar matrices: $B = P^{-1} A P$ for some invertible $P$.' },
          { label: 'C' as const, body: '$A$ and $B$ have the same columns but in different positions.' },
          { label: 'D' as const, body: '$A$ and $B$ have the same rows but in different positions.' },
          { label: 'E' as const, body: '$\\text{rank}(A) \\neq \\text{rank}(B)$ in general.' },
        ],
        correctAnswer: 'B' as const,
        solution: {
          explanation: 'Matrices representing the same linear transformation in different bases are similar. If $P$ is the change-of-basis matrix from $\\mathcal{B}$ to $\\mathcal{E}$, then $B = P^{-1} A P$.',
          trickAnalysis: [
            { choice: 'A' as const, why: 'Confuses "same transformation" with "same matrix." The transformation is intrinsic; the matrix depends on the basis.' },
            { choice: 'C' as const, why: 'Similar matrices generally have completely different columns, not just rearranged ones.' },
            { choice: 'D' as const, why: 'Same issue.' },
            { choice: 'E' as const, why: 'Similar matrices have the SAME rank — rank is a similarity invariant.' },
          ],
        },
      },
      {
        id: 'P-4.5b',
        format: 'multiple-choice' as const,
        difficulty: 2,
        statement: 'Which of the following properties is NOT necessarily preserved under similarity transformations? That is, if $B = P^{-1} A P$ for some invertible $P$, which property might differ between $A$ and $B$?',
        choices: [
          { label: 'A' as const, body: 'The determinant.' },
          { label: 'B' as const, body: 'The trace.' },
          { label: 'C' as const, body: 'The rank.' },
          { label: 'D' as const, body: 'The $(1, 1)$ entry of the matrix.' },
          { label: 'E' as const, body: 'The nullity.' },
        ],
        correctAnswer: 'D' as const,
        solution: {
          explanation: 'Individual entries change under similarity in general. The $(1, 1)$ entry — or any specific entry — depends on the basis chosen, not on the underlying transformation. Determinant, trace, rank, and nullity are all preserved (intrinsic properties of the transformation).',
          trickAnalysis: [
            { choice: 'A' as const, why: 'Preserved: $\\det(P^{-1} A P) = \\det(P)^{-1} \\det(A) \\det(P) = \\det(A)$.' },
            { choice: 'B' as const, why: 'Preserved: $\\text{tr}(P^{-1} A P) = \\text{tr}(A P P^{-1}) = \\text{tr}(A)$, by the cyclic property of trace.' },
            { choice: 'C' as const, why: 'Preserved: rank is intrinsic to the transformation.' },
            { choice: 'E' as const, why: 'Preserved: by rank-nullity, if rank is preserved, so is nullity.' },
          ],
        },
      },
      {
        id: 'P-4.5c',
        format: 'multiple-choice' as const,
        difficulty: 2,
        statement: 'Consider a linear transformation $T: V \\to V$ on a finite-dimensional vector space. Two students compute its matrix representation: Student A uses basis $\\mathcal{B}_1$ and gets matrix $M_1$, while Student B uses basis $\\mathcal{B}_2$ and gets matrix $M_2$. They find that $M_1 \\neq M_2$. Which statement best explains this situation?',
        choices: [
          { label: 'A' as const, body: 'One student must have made a computational error since a transformation has a unique matrix representation.' },
          { label: 'B' as const, body: 'The transformation $T$ acts differently depending on which basis is used to describe it.' },
          { label: 'C' as const, body: 'Both matrices correctly represent the same transformation; they appear different because they describe $T$\'s action using different coordinate systems.' },
          { label: 'D' as const, body: 'This can only happen if the bases $\\mathcal{B}_1$ and $\\mathcal{B}_2$ have some vectors in common.' },
          { label: 'E' as const, body: 'The matrices $M_1$ and $M_2$ must have the same entries but in different positions.' },
        ],
        correctAnswer: 'C' as const,
        solution: {
          explanation: 'A linear transformation exists as an abstract mapping independent of coordinates. Different bases provide different "lenses" through which to describe the same transformation, resulting in different matrix representations. These matrices are related by similarity: $M_2 = P^{-1} M_1 P$, where $P$ is the change-of-basis matrix. The transformation itself does not change — only our numerical description of it.',
          trickAnalysis: [
            { choice: 'A' as const, why: 'Misunderstands that matrix representation depends on basis choice. Both students are correct.' },
            { choice: 'B' as const, why: 'The transformation acts the same way; only its coordinate description changes.' },
            { choice: 'D' as const, why: 'Common vectors are irrelevant. Two bases can give different matrices regardless of overlap.' },
            { choice: 'E' as const, why: 'Similar matrices generally have completely different entries, not just rearranged ones.' },
          ],
        },
      },
    ],
  },
};
