import { MarkdownMath } from '../math/MarkdownMath';
import { MisconceptionCallout } from './MisconceptionCallout';
import { EigenvectorViz } from '../visualizations/EigenvectorViz';
import { GramSchmidtViz } from '../visualizations/GramSchmidtViz';
import { LinearSystemViz } from '../visualizations/LinearSystemViz';
import { SpecialMatrixGallery } from '../visualizations/SpecialMatrixGallery';
import { RowReductionStepper } from '../visualizations/RowReductionStepper';
import { InverseViz } from '../visualizations/InverseViz';
import { EliminationAsMatrices } from '../visualizations/EliminationAsMatrices';
import { LUStepper } from '../visualizations/LUStepper';
import { PLUStepper } from '../visualizations/PLUStepper';
import { ConditioningViz } from '../visualizations/ConditioningViz';
import { NetworkFlowViz } from '../visualizations/NetworkFlowViz';
import { TrussViz } from '../visualizations/TrussViz';
import { VectorSpaceAxiomsViz } from '../visualizations/VectorSpaceAxiomsViz';
import { VectorSpaceExamplesViz } from '../visualizations/VectorSpaceExamplesViz';
import { SubspaceTester } from '../visualizations/SubspaceTester';
import { SpanAndIndependenceViz } from '../visualizations/SpanAndIndependenceViz';
import { DimensionViz } from '../visualizations/DimensionViz';
import { FundamentalTheoremViz } from '../visualizations/FundamentalTheoremViz';
import { LinearTransformGallery } from '../visualizations/LinearTransformGallery';
import { RankNullityViz } from '../visualizations/RankNullityViz';
import { EuclideanTransformViz } from '../visualizations/EuclideanTransformViz';
import { InjectiveSurjectiveViz } from '../visualizations/InjectiveSurjectiveViz';
import { KernelImageViz } from '../visualizations/KernelImageViz';
import { LinearityChecker } from '../visualizations/LinearityChecker';
import { QuotientViz } from '../visualizations/QuotientViz';
import { CoimageCokernelViz } from '../visualizations/CoimageCokernelViz';
import { BasisExplorer } from '../visualizations/BasisExplorer';
import { CoordinateViz } from '../visualizations/CoordinateViz';
import { ChangeOfBasisViz } from '../visualizations/ChangeOfBasisViz';
import { MatrixRepresentationViz } from '../visualizations/MatrixRepresentationViz';
import { SimilarityViz } from '../visualizations/SimilarityViz';
import { OrthogonalTransformViz } from '../visualizations/OrthogonalTransformViz';
import { InnerProductViz } from '../visualizations/InnerProductViz';
import { AnglesViz } from '../visualizations/AnglesViz';
import { OrthonormalBasisViz } from '../visualizations/OrthonormalBasisViz';
import { AdjointViz } from '../visualizations/AdjointViz';
import { QRDecompositionViz } from '../visualizations/QRDecompositionViz';
import { GeometricFTLAViz } from '../visualizations/GeometricFTLAViz';
import { OrthogonalComplementViz } from '../visualizations/OrthogonalComplementViz';
import { IterationViz } from '../visualizations/IterationViz';
import { DominanceConvergenceViz } from '../visualizations/DominanceConvergenceViz';
import { PerronFrobeniusViz } from '../visualizations/PerronFrobeniusViz';
import { SymmetricSpectraViz } from '../visualizations/SymmetricSpectraViz';
import { ConsensusViz } from '../visualizations/ConsensusViz';
import { SphereToEllipsoidViz } from '../visualizations/SphereToEllipsoidViz';
import { PolarDecompositionViz } from '../visualizations/PolarDecompositionViz';
import { SVDStructureViz } from '../visualizations/SVDStructureViz';
import { SVDInvarianceViz } from '../visualizations/SVDInvarianceViz';
import { CovarianceCorrelationViz } from '../visualizations/CovarianceCorrelationViz';
import { PrincipalComponentsViz } from '../visualizations/PrincipalComponentsViz';
import { PcaOptimalityViz } from '../visualizations/PcaOptimalityViz';
import { PcaPreprocessingViz } from '../visualizations/PcaPreprocessingViz';
import { StatisticalSignificanceViz } from '../visualizations/StatisticalSignificanceViz';
import { BeyondLinearPcaViz } from '../visualizations/BeyondLinearPcaViz';
import { EckartMirskyYoungViz } from '../visualizations/EckartMirskyYoungViz';
import { LowRankInPracticeViz } from '../visualizations/LowRankInPracticeViz';
import { ScalingAlgorithmsViz } from '../visualizations/ScalingAlgorithmsViz';
import { MatrixCompletionViz } from '../visualizations/MatrixCompletionViz';
import { RobustPCAViz } from '../visualizations/RobustPCAViz';
import type { Concept } from '../../content/types';

const VIZ_REGISTRY: Record<string, React.FC> = {
  EigenvectorViz: () => <EigenvectorViz />,
  GramSchmidtViz: () => <GramSchmidtViz />,
  LinearSystemViz,
  SpecialMatrixGallery,
  RowReductionStepper,
  InverseViz,
  EliminationAsMatrices,
  LUStepper,
  PLUStepper,
  ConditioningViz,
  NetworkFlowViz,
  TrussViz,
  VectorSpaceAxiomsViz,
  VectorSpaceExamplesViz,
  SubspaceTester,
  SpanAndIndependenceViz,
  DimensionViz,
  FundamentalTheoremViz,
  LinearTransformGallery,
  RankNullityViz,
  EuclideanTransformViz,
  InjectiveSurjectiveViz,
  KernelImageViz,
  LinearityChecker,
  QuotientViz,
  CoimageCokernelViz,
  BasisExplorer,
  CoordinateViz,
  ChangeOfBasisViz,
  MatrixRepresentationViz,
  SimilarityViz,
  OrthogonalTransformViz,
  InnerProductViz,
  AnglesViz,
  OrthonormalBasisViz,
  AdjointViz,
  QRDecompositionViz,
  GeometricFTLAViz,
  OrthogonalComplementViz,
  IterationViz,
  DominanceConvergenceViz,
  PerronFrobeniusViz,
  SymmetricSpectraViz,
  ConsensusViz,
  SphereToEllipsoidViz,
  PolarDecompositionViz,
  SVDStructureViz,
  SVDInvarianceViz,
  CovarianceCorrelationViz,
  PrincipalComponentsViz,
  PcaOptimalityViz,
  PcaPreprocessingViz,
  StatisticalSignificanceViz,
  BeyondLinearPcaViz,
  EckartMirskyYoungViz,
  LowRankInPracticeViz,
  ScalingAlgorithmsViz,
  MatrixCompletionViz,
  RobustPCAViz,
};

export function ExploreTab({ concept }: { concept: Concept }) {
  if (!concept.explore) {
    return (
      <div style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)', fontSize: 12, padding: 24 }}>
        Interactive visualization not yet available for this concept.
      </div>
    );
  }
  const { vizComponent, description, misconception } = concept.explore;
  const VizComponent = vizComponent ? VIZ_REGISTRY[vizComponent] : null;
  const skipViz = vizComponent === null;

  return (
    <div style={{ maxWidth: 760 }}>
      <div
        style={{
          fontSize: 14,
          color: 'var(--text-secondary)',
          lineHeight: 1.65,
          marginBottom: skipViz ? 32 : 24,
        }}
      >
        <MarkdownMath source={description} />
      </div>

      {!skipViz && (
        <div style={{ marginBottom: 32 }}>
          {VizComponent ? (
            <VizComponent />
          ) : (
            <div
              style={{
                background: 'var(--bg-panel)',
                border: '1px dashed var(--border-subtle)',
                borderRadius: 8,
                padding: '32px 24px',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 9,
                  color: 'var(--text-tertiary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginBottom: 8,
                }}
              >
                {vizComponent}
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-tertiary)', fontStyle: 'italic' }}>
                Visualization coming soon — read the misconception below for the conceptual takeaway.
              </div>
            </div>
          )}
        </div>
      )}

      <MisconceptionCallout title={misconception.title} body={misconception.body} />
    </div>
  );
}
