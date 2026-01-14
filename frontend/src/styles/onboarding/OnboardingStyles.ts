import { styled, keyframes } from "@mui/material/styles";
import { Box, Typography, LinearProgress } from "@mui/material";

/* ==================== VARIABLES ==================== */
const colors = {
  mcgillRed: "#ED1B2F",
  mcgillRedDark: "#C8102E",
  success: "#28A745",
  successLight: "#D4EDDA",
  warning: "#FFC107",
  warningLight: "#FFF3CD",
  danger: "#DC3545",
  dangerLight: "#F8D7DA",
  info: "#17A2B8",
  infoLight: "#D1ECF1",
};

/* ==================== ANIMATIONS ==================== */
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

/* ==================== CONTAINER ==================== */
export const OnboardingContainer = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  backgroundColor: theme.palette.grey[50],
  padding: theme.spacing(4),

  [theme.breakpoints.down("md")]: {
    padding: theme.spacing(2),
  },

  ...(theme.palette.mode === "dark" && {
    backgroundColor: theme.palette.grey[900],
  }),
}));

export const OnboardingInner = styled(Box)({
  maxWidth: 900,
  margin: "0 auto",
});

/* ==================== PROGRESS ==================== */
export const ProgressContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

export const ProgressSteps = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  gap: theme.spacing(6),
  marginBottom: theme.spacing(2),

  [theme.breakpoints.down("sm")]: {
    gap: theme.spacing(2),
  },
}));

interface StepProps {
  active?: boolean;
  completed?: boolean;
}

export const Step = styled(Box, {
  shouldForwardProp: (prop) =>
    !["active", "completed"].includes(prop as string),
})<StepProps>(({ theme, active, completed }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: theme.spacing(1),
}));

export const StepNumber = styled(Box, {
  shouldForwardProp: (prop) =>
    !["active", "completed"].includes(prop as string),
})<StepProps>(({ theme, active, completed }) => ({
  width: 40,
  height: 40,
  borderRadius: "50%",
  backgroundColor: theme.palette.grey[200],
  color: theme.palette.grey[500],
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 700,
  transition: "all 0.25s ease",

  ...(active && {
    backgroundColor: colors.mcgillRed,
    color: theme.palette.common.white,
  }),

  ...(completed && {
    backgroundColor: colors.success,
    color: theme.palette.common.white,
  }),
}));

export const StepLabel = styled(Typography, {
  shouldForwardProp: (prop) =>
    !["active", "completed"].includes(prop as string),
})<StepProps>(({ theme, active }) => ({
  fontSize: "0.8125rem",
  color: theme.palette.grey[500],

  ...(active && {
    color: theme.palette.grey[800],
    fontWeight: 600,
  }),

  [theme.breakpoints.down("sm")]: {
    display: "none",
  },
}));

export const ProgressBar = styled(LinearProgress)(({ theme }) => ({
  height: 4,
  borderRadius: 9999,
  backgroundColor: theme.palette.grey[200],

  "& .MuiLinearProgress-bar": {
    backgroundColor: colors.mcgillRed,
    borderRadius: 9999,
  },
}));

/* ==================== CARD ==================== */
interface ProfileCardProps {
  wide?: boolean;
}

export const ProfileCard = styled(Box, {
  shouldForwardProp: (prop) => prop !== "wide",
})<ProfileCardProps>(({ theme, wide }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(4),
  borderRadius: (theme.shape.borderRadius as number) * 2,
  boxShadow: theme.shadows[4],
  animation: `${fadeIn} 0.3s ease-out`,

  ...(wide && {
    maxWidth: 1000,
  }),

  ...(theme.palette.mode === "dark" && {
    backgroundColor: theme.palette.grey[800],
  }),
}));

export const CardTitle = styled(Typography)(({ theme }) => ({
  fontSize: "1.5rem",
  fontWeight: 700,
  marginBottom: theme.spacing(1),
}));

export const CardDescription = styled(Typography)(({ theme }) => ({
  color: theme.palette.grey[600],
  marginBottom: theme.spacing(3),
}));

/* ==================== FORM ==================== */
export const FormRow = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: theme.spacing(2),

  [theme.breakpoints.down("sm")]: {
    gridTemplateColumns: "1fr",
  },
}));

export const FormGroup = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2.5),
}));

export const FormLabel = styled("label")(({ theme }) => ({
  display: "block",
  fontSize: "0.875rem",
  fontWeight: 600,
  color: theme.palette.text.primary,
  marginBottom: theme.spacing(0.75),
}));

export const FormInput = styled("input")(({ theme }) => ({
  width: "100%",
  padding: theme.spacing(1.5),
  fontSize: "1rem",
  border: `1px solid ${theme.palette.grey[300]}`,
  borderRadius: theme.shape.borderRadius,
  transition: "border-color 0.2s ease",

  "&:focus": {
    outline: "none",
    borderColor: colors.mcgillRed,
  },

  "&::placeholder": {
    color: theme.palette.grey[400],
  },
}));

export const FormSelect = styled("select")(({ theme }) => ({
  width: "100%",
  padding: theme.spacing(1.5),
  fontSize: "1rem",
  border: `1px solid ${theme.palette.grey[300]}`,
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  cursor: "pointer",

  "&:focus": {
    outline: "none",
    borderColor: colors.mcgillRed,
  },
}));

/* ==================== STEP ACTIONS ==================== */
export const StepActions = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "flex-end",
  gap: theme.spacing(2),
  marginTop: theme.spacing(3),
  paddingTop: theme.spacing(3),
  borderTop: `1px solid ${theme.palette.grey[200]}`,
}));

/* ==================== LEARNING STYLES ==================== */
export const LearningStylesGrid = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: theme.spacing(2),

  [theme.breakpoints.down("sm")]: {
    gridTemplateColumns: "1fr",
  },
}));

export const StyleOption = styled("label")({
  cursor: "pointer",

  "& input": {
    display: "none",
  },
});

interface StyleCardProps {
  selected?: boolean;
}

export const StyleCard = styled(Box, {
  shouldForwardProp: (prop) => prop !== "selected",
})<StyleCardProps>(({ theme, selected }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: theme.spacing(2.5),
  backgroundColor: theme.palette.grey[50],
  border: `2px solid ${theme.palette.grey[200]}`,
  borderRadius: (theme.shape.borderRadius as number) * 1.5,
  transition: "all 0.2s ease",

  "&:hover": {
    borderColor: theme.palette.grey[300],
  },

  ...(selected && {
    borderColor: colors.mcgillRed,
    backgroundColor: "rgba(237, 27, 47, 0.05)",
  }),
}));

export const StyleIcon = styled(Box)({
  fontSize: "2rem",
  marginBottom: 8,
});

export const StyleName = styled(Typography)({
  fontWeight: 600,
  marginBottom: 4,
});

export const StyleDesc = styled(Typography)(({ theme }) => ({
  fontSize: "0.75rem",
  color: theme.palette.grey[500],
  textAlign: "center",
}));

/* ==================== SKILLS SELECTION ==================== */
export const SkillsSelection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

export const SkillCategory = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

export const CategoryTitle = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  fontSize: "1rem",
  fontWeight: 700,
  marginBottom: theme.spacing(2),
  paddingBottom: theme.spacing(1),
  borderBottom: `2px solid ${theme.palette.grey[200]}`,
}));

export const CategoryIcon = styled(Box)({
  fontSize: "1.5rem",
});

interface CategoryTagProps {
  variant?: "info" | "warning";
}

export const CategoryTag = styled(Box, {
  shouldForwardProp: (prop) => prop !== "variant",
})<CategoryTagProps>(({ theme, variant = "info" }) => ({
  fontSize: "0.6875rem",
  fontWeight: 600,
  padding: "2px 8px",
  borderRadius: 4,
  marginLeft: "auto",

  ...(variant === "info" && {
    backgroundColor: colors.infoLight,
    color: colors.info,
  }),

  ...(variant === "warning" && {
    backgroundColor: colors.warningLight,
    color: "#856404",
  }),
}));

export const SkillsGrid = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
  gap: theme.spacing(2),
}));

export const SkillOption = styled("label")({
  cursor: "pointer",

  "& input": {
    display: "none",
  },
});

interface SkillCardProps {
  selected?: boolean;
}

export const SkillCard = styled(Box, {
  shouldForwardProp: (prop) => prop !== "selected",
})<SkillCardProps>(({ theme, selected }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  border: `2px solid ${theme.palette.grey[200]}`,
  borderRadius: (theme.shape.borderRadius as number) * 1.5,
  transition: "all 0.2s ease",
  textAlign: "center",

  "&:hover": {
    borderColor: theme.palette.grey[300],
  },

  ...(selected && {
    borderColor: colors.mcgillRed,
    backgroundColor: "rgba(237, 27, 47, 0.05)",
  }),
}));

export const SkillLogo = styled(Box)({
  fontSize: "2rem",
  marginBottom: 8,
});

export const SkillName = styled(Typography)({
  fontWeight: 600,
  fontSize: "0.875rem",
  marginBottom: 4,
});

export const SkillType = styled(Box)(({ theme }) => ({
  fontSize: "0.6875rem",
  color: theme.palette.grey[500],
  backgroundColor: theme.palette.grey[100],
  padding: "2px 8px",
  borderRadius: 4,
}));

export const SkillPrereq = styled(Typography)(({ theme }) => ({
  display: "block",
  fontSize: "0.625rem",
  color: colors.warning,
  marginTop: theme.spacing(1),
}));

export const SelectedSkillsSummary = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.grey[50],
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
}));

export const SelectedSkillsList = styled(Box)(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  gap: theme.spacing(1),
  marginTop: theme.spacing(1),
}));

export const SelectedSkillTag = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(0.5),
  backgroundColor: colors.mcgillRed,
  color: theme.palette.common.white,
  padding: "4px 12px",
  borderRadius: 9999,
  fontSize: "0.8125rem",
  fontWeight: 500,
}));

/* ==================== GOALS ==================== */
export const GoalsGrid = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: theme.spacing(2),
  marginBottom: theme.spacing(3),

  [theme.breakpoints.down("md")]: {
    gridTemplateColumns: "repeat(2, 1fr)",
  },

  [theme.breakpoints.down("sm")]: {
    gridTemplateColumns: "1fr",
  },
}));

export const GoalOption = styled("label")({
  cursor: "pointer",

  "& input": {
    display: "none",
  },
});

interface GoalCardProps {
  selected?: boolean;
}

export const GoalCard = styled(Box, {
  shouldForwardProp: (prop) => prop !== "selected",
})<GoalCardProps>(({ theme, selected }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: theme.spacing(2.5),
  backgroundColor: theme.palette.background.paper,
  border: `2px solid ${theme.palette.grey[200]}`,
  borderRadius: (theme.shape.borderRadius as number) * 1.5,
  transition: "all 0.2s ease",

  "&:hover": {
    borderColor: theme.palette.grey[300],
  },

  ...(selected && {
    borderColor: colors.mcgillRed,
    backgroundColor: "rgba(237, 27, 47, 0.05)",
  }),
}));

export const GoalIcon = styled(Box)({
  fontSize: "2rem",
  marginBottom: 8,
});

export const GoalName = styled(Typography)({
  fontWeight: 600,
  fontSize: "0.875rem",
  textAlign: "center",
});

export const DailyGoalSelector = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(1),

  [theme.breakpoints.down("sm")]: {
    flexWrap: "wrap",
  },
}));

interface DailyGoalBtnProps {
  selected?: boolean;
}

export const DailyGoalBtn = styled("button", {
  shouldForwardProp: (prop) => prop !== "selected",
})<DailyGoalBtnProps>(({ theme, selected }) => ({
  flex: 1,
  padding: theme.spacing(2),
  border: `2px solid ${theme.palette.grey[200]}`,
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  fontWeight: 600,
  fontSize: "0.875rem",
  cursor: "pointer",
  transition: "all 0.2s ease",

  "&:hover": {
    borderColor: colors.mcgillRed,
    backgroundColor: "rgba(237, 27, 47, 0.05)",
  },

  ...(selected && {
    borderColor: colors.mcgillRed,
    backgroundColor: "rgba(237, 27, 47, 0.05)",
  }),
}));

/* ==================== TEST ==================== */
export const TestContainer = styled(Box)(({ theme }) => ({
  maxWidth: 800,
  margin: "0 auto",
}));

export const TestHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: theme.spacing(2),
}));

export const TestInfo = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(3),
}));

export const TestSkill = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  fontWeight: 600,
}));

export const TestProgress = styled(Typography)(({ theme }) => ({
  color: theme.palette.grey[600],
  fontSize: "0.875rem",
}));

export const TestTimer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  fontFamily: '"Fira Code", monospace',
  fontSize: "1.125rem",
  fontWeight: 600,
  color: colors.mcgillRed,
}));

export const TestProgressBar = styled(LinearProgress)(({ theme }) => ({
  height: 6,
  borderRadius: 9999,
  backgroundColor: theme.palette.grey[200],
  marginBottom: theme.spacing(3),

  "& .MuiLinearProgress-bar": {
    backgroundColor: colors.mcgillRed,
  },
}));

export const QuestionCard = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(4),
  borderRadius: (theme.shape.borderRadius as number) * 2,
  boxShadow: theme.shadows[4],
  marginBottom: theme.spacing(3),

  ...(theme.palette.mode === "dark" && {
    backgroundColor: theme.palette.grey[800],
  }),
}));

export const QuestionHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  marginBottom: theme.spacing(2),
}));

interface DifficultyBadgeProps {
  level?: "easy" | "medium" | "hard";
}

export const DifficultyBadge = styled(Box, {
  shouldForwardProp: (prop) => prop !== "level",
})<DifficultyBadgeProps>(({ level = "medium" }) => ({
  fontSize: "0.75rem",
  fontWeight: 600,
  padding: "4px 12px",
  borderRadius: 9999,

  ...(level === "easy" && {
    backgroundColor: colors.successLight,
    color: colors.success,
  }),

  ...(level === "medium" && {
    backgroundColor: colors.warningLight,
    color: "#856404",
  }),

  ...(level === "hard" && {
    backgroundColor: colors.dangerLight,
    color: colors.danger,
  }),
}));

export const QuestionTopic = styled(Typography)(({ theme }) => ({
  fontSize: "0.75rem",
  color: theme.palette.grey[500],
}));

export const QuestionText = styled(Typography)(({ theme }) => ({
  fontSize: "1.125rem",
  marginBottom: theme.spacing(2),
  lineHeight: 1.5,

  "& code": {
    backgroundColor: theme.palette.grey[100],
    padding: "2px 6px",
    borderRadius: 4,
    fontFamily: '"Fira Code", monospace',
    fontSize: "0.875rem",
  },
}));

export const CodeBlock = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.grey[900],
  borderRadius: (theme.shape.borderRadius as number) * 1.5,
  marginBottom: theme.spacing(2),
  overflow: "hidden",
}));

export const CodeHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: theme.spacing(1, 2),
  backgroundColor: theme.palette.grey[800],
}));

export const CodeLang = styled(Typography)(({ theme }) => ({
  fontSize: "0.75rem",
  color: theme.palette.grey[400],
}));

export const CodeCopy = styled("button")(({ theme }) => ({
  background: "transparent",
  border: "none",
  color: theme.palette.grey[400],
  fontSize: "0.75rem",
  cursor: "pointer",

  "&:hover": {
    color: theme.palette.common.white,
  },
}));

export const CodePre = styled("pre")(({ theme }) => ({
  padding: theme.spacing(2),
  margin: 0,
  overflowX: "auto",
}));

export const CodeContent = styled("code")(({ theme }) => ({
  fontFamily: '"Fira Code", monospace',
  fontSize: "0.875rem",
  color: theme.palette.grey[100],
  lineHeight: 1.6,
}));

export const AnswerOptions = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
}));

export const AnswerOption = styled("label")({
  cursor: "pointer",

  "& input": {
    display: "none",
  },
});

interface OptionContentProps {
  selected?: boolean;
  correct?: boolean;
  incorrect?: boolean;
}

export const OptionContent = styled(Box, {
  shouldForwardProp: (prop) =>
    !["selected", "correct", "incorrect"].includes(prop as string),
})<OptionContentProps>(({ theme, selected, correct, incorrect }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  backgroundColor: theme.palette.grey[50],
  border: `2px solid ${theme.palette.grey[200]}`,
  borderRadius: theme.shape.borderRadius,
  transition: "all 0.2s ease",

  "&:hover": {
    borderColor: theme.palette.grey[300],
  },

  ...(selected && {
    borderColor: colors.mcgillRed,
    backgroundColor: "rgba(237, 27, 47, 0.05)",
  }),

  ...(correct && {
    borderColor: colors.success,
    backgroundColor: colors.successLight,
  }),

  ...(incorrect && {
    borderColor: colors.danger,
    backgroundColor: colors.dangerLight,
  }),
}));

export const OptionLetter = styled(Box, {
  shouldForwardProp: (prop) =>
    !["selected", "correct", "incorrect"].includes(prop as string),
})<OptionContentProps>(({ theme, selected, correct, incorrect }) => ({
  width: 32,
  height: 32,
  backgroundColor: theme.palette.grey[200],
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 700,
  fontSize: "0.875rem",
  flexShrink: 0,

  ...(selected && {
    backgroundColor: colors.mcgillRed,
    color: theme.palette.common.white,
  }),

  ...(correct && {
    backgroundColor: colors.success,
    color: theme.palette.common.white,
  }),

  ...(incorrect && {
    backgroundColor: colors.danger,
    color: theme.palette.common.white,
  }),
}));

export const OptionText = styled(Typography)({
  fontFamily: '"Fira Code", monospace',
});

export const HintSection = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
  paddingTop: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.grey[200]}`,
}));

export const HintBtn = styled("button")(({ theme }) => ({
  background: "transparent",
  border: `1px dashed ${theme.palette.grey[300]}`,
  padding: theme.spacing(1, 2),
  borderRadius: theme.shape.borderRadius,
  color: theme.palette.grey[600],
  cursor: "pointer",
  transition: "all 0.2s ease",

  "&:hover": {
    borderColor: colors.info,
    color: colors.info,
  },
}));

export const HintCost = styled("span")(({ theme }) => ({
  fontSize: "0.6875rem",
  color: theme.palette.grey[400],
  marginLeft: theme.spacing(0.5),
}));

export const HintContent = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
  padding: theme.spacing(2),
  backgroundColor: colors.infoLight,
  borderRadius: theme.shape.borderRadius,
  fontSize: "0.875rem",
  color: colors.info,
}));

export const TestActions = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
});

/* ==================== RESULTS ==================== */
export const ResultsContainer = styled(Box)(({ theme }) => ({
  maxWidth: 1000,
  margin: "0 auto",
}));

export const ResultsHeader = styled(Box)(({ theme }) => ({
  textAlign: "center",
  marginBottom: theme.spacing(4),
}));

export const ResultsBadge = styled(Box)(({ theme }) => ({
  display: "inline-flex",
  flexDirection: "column",
  alignItems: "center",
  padding: theme.spacing(2, 4),
  background: `linear-gradient(135deg, ${colors.mcgillRed}, ${colors.mcgillRedDark})`,
  borderRadius: (theme.shape.borderRadius as number) * 2,
  color: theme.palette.common.white,
  marginBottom: theme.spacing(2),
  animation: `${pulse} 2s ease-in-out infinite`,
}));

export const BadgeIcon = styled(Box)({
  fontSize: "3rem",
  marginBottom: 8,
});

export const BadgeLevel = styled(Typography)({
  fontSize: "1.125rem",
  fontWeight: 700,
});

export const ResultsTitle = styled(Typography)(({ theme }) => ({
  fontSize: "1.75rem",
  fontWeight: 700,
  marginBottom: theme.spacing(0.5),
}));

export const ResultsSubtitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.grey[600],
}));

export const ResultsGrid = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: theme.spacing(3),
  marginBottom: theme.spacing(4),

  [theme.breakpoints.down("md")]: {
    gridTemplateColumns: "1fr",
  },
}));

export const ResultsCard = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(3),
  borderRadius: (theme.shape.borderRadius as number) * 2,
  boxShadow: theme.shadows[2],

  "& h3": {
    fontSize: "1rem",
    fontWeight: 700,
    marginBottom: theme.spacing(2),
  },

  ...(theme.palette.mode === "dark" && {
    backgroundColor: theme.palette.grey[800],
  }),
}));

export const ScoreCard = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(3),
  borderRadius: (theme.shape.borderRadius as number) * 2,
  boxShadow: theme.shadows[2],
  display: "flex",
  gap: theme.spacing(3),
  alignItems: "center",

  ...(theme.palette.mode === "dark" && {
    backgroundColor: theme.palette.grey[800],
  }),
}));

export const ScoreCircle = styled(Box)({
  position: "relative",
  width: 120,
  height: 120,
  flexShrink: 0,
});

export const ScoreCircleSvg = styled("svg")({
  transform: "rotate(-90deg)",
  width: "100%",
  height: "100%",
});

export const ScoreCircleBg = styled("circle")(({ theme }) => ({
  fill: "none",
  stroke: theme.palette.grey[200],
  strokeWidth: 8,
}));

export const ScoreCircleFill = styled("circle")({
  fill: "none",
  stroke: colors.mcgillRed,
  strokeWidth: 8,
  strokeLinecap: "round",
  transition: "stroke-dashoffset 1s ease",
});

export const ScoreValue = styled(Box)({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  textAlign: "center",
});

export const ScoreNumber = styled(Typography)({
  fontSize: "2.25rem",
  fontWeight: 800,
  color: colors.mcgillRed,
  lineHeight: 1,
});

export const ScoreUnit = styled(Typography)(({ theme }) => ({
  fontSize: "0.875rem",
  color: theme.palette.grey[500],
}));

export const ScoreDetails = styled(Box)({
  flex: 1,
});

export const ScoreStat = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  padding: theme.spacing(1, 0),
  borderBottom: `1px solid ${theme.palette.grey[100]}`,

  "&:last-child": {
    borderBottom: "none",
  },
}));

export const StatLabel = styled(Typography)(({ theme }) => ({
  color: theme.palette.grey[600],
  fontSize: "0.875rem",
}));

export const StatValue = styled(Typography)({
  fontWeight: 600,
});

export const TopicsBreakdown = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1.5),
}));

interface TopicRowProps {
  isWeak?: boolean;
}

export const TopicRow = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isWeak",
})<TopicRowProps>(({ theme, isWeak }) => ({
  display: "grid",
  gridTemplateColumns: "150px 1fr 60px",
  gap: theme.spacing(2),
  alignItems: "center",

  ...(isWeak && {
    backgroundColor: colors.dangerLight,
    padding: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
    margin: `0 ${theme.spacing(-1)}`,
  }),

  [theme.breakpoints.down("sm")]: {
    gridTemplateColumns: "100px 1fr 50px",
  },
}));

export const TopicName = styled(Typography)({
  fontSize: "0.8125rem",
  fontWeight: 500,
});

export const TopicBar = styled(Box)(({ theme }) => ({
  height: 8,
  backgroundColor: theme.palette.grey[200],
  borderRadius: 9999,
  overflow: "hidden",
}));

export const TopicFill = styled(Box)({
  height: "100%",
  backgroundColor: colors.mcgillRed,
  borderRadius: 9999,
});

interface TopicScoreProps {
  level?: "excellent" | "good" | "medium" | "weak";
}

export const TopicScore = styled(Typography, {
  shouldForwardProp: (prop) => prop !== "level",
})<TopicScoreProps>(({ level = "medium" }) => ({
  fontSize: "0.8125rem",
  fontWeight: 600,
  textAlign: "right",

  ...(level === "excellent" && { color: colors.success }),
  ...(level === "good" && { color: colors.info }),
  ...(level === "medium" && { color: colors.warning }),
  ...(level === "weak" && { color: colors.danger }),
}));

export const RecommendationsCard = styled(ResultsCard)({
  gridColumn: "span 2",

  "@media (max-width: 900px)": {
    gridColumn: "span 1",
  },
});

export const MentorMessage = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(2),
}));

export const MentorAvatar = styled(Box)({
  fontSize: "3rem",
  flexShrink: 0,
});

export const MentorText = styled(Box)(({ theme }) => ({
  "& p": {
    marginBottom: theme.spacing(1),
  },

  "& ul": {
    margin: `${theme.spacing(1)} 0 ${theme.spacing(1)} ${theme.spacing(2)}`,
  },

  "& li": {
    marginBottom: theme.spacing(0.5),
  },
}));

export const ResultsActions = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  gap: theme.spacing(2),
}));




