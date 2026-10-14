import { memo, useMemo } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type AssessmentType = "Recorded" | "Text";
type AssessmentStatus = "Completed" | "Pending";

type Assessment = {
  id: string;
  question: string;
  type: AssessmentType;
  score?: number;
  status: AssessmentStatus;
  feedback?: string;
};

const GOOD_SCORE_THRESHOLD = 70;

const assessments: Assessment[] = [
  {
    id: "1",
    question: "Tell me about yourself",
    type: "Recorded",
    score: 82,
    status: "Completed",
    feedback:
      "Strong introduction. Your response was clear and well structured. Add a specific achievement to make it more memorable.",
  },
  {
    id: "2",
    question: "Describe a challenging situation",
    type: "Recorded",
    score: 65,
    status: "Completed",
    feedback:
      "You identified the challenge well. Explain the actions you personally took and the outcome to strengthen your response.",
  },
  {
    id: "3",
    question: "Write a professional email to your manager",
    type: "Text",
    score: 78,
    status: "Completed",
    feedback:
      "Your message is professional and easy to understand. Consider making the requested action more explicit.",
  },
  {
    id: "4",
    question: "Explain your current project",
    type: "Recorded",
    status: "Pending",
  },
];

const AssessmentCard = memo(({ assessment }: { assessment: Assessment }) => {
  const isGood =
    assessment.score !== undefined && assessment.score >= GOOD_SCORE_THRESHOLD;

  return (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <View style={styles.typeBadge}>
          <Text style={styles.typeText}>{assessment.type}</Text>
        </View>

        <View
          style={[
            styles.statusBadge,
            isGood ? styles.goodBadge : styles.improvementBadge,
          ]}
        >
          <Text
            style={[
              styles.statusText,
              isGood ? styles.goodText : styles.improvementText,
            ]}
          >
            {isGood ? "Good" : "Needs Improvement"}
          </Text>
        </View>
      </View>

      <Text style={styles.question}>{assessment.question}</Text>

      <View style={styles.scoreRow}>
        <Text style={styles.scoreLabel}>Assessment score</Text>
        <Text style={styles.score}>{assessment.score}/100</Text>
      </View>

      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressFill,
            { width: `${assessment.score ?? 0}%` },
            isGood ? styles.goodFill : styles.improvementFill,
          ]}
        />
      </View>

      <View style={styles.feedbackBox}>
        <Text style={styles.feedbackHeading}>AI FEEDBACK</Text>
        <Text style={styles.feedback}>
          {assessment.feedback || "Feedback is not available yet."}
        </Text>
      </View>
    </View>
  );
});

AssessmentCard.displayName = "AssessmentCard";

export default function HomeScreen() {
  const completedAssessments = useMemo(
    () =>
      assessments.filter(
        (assessment) =>
          assessment.status === "Completed" && assessment.score !== undefined,
      ),
    [],
  );

  const averageScore = useMemo(() => {
    if (completedAssessments.length === 0) return 0;

    const total = completedAssessments.reduce(
      (sum, assessment) => sum + assessment.score!,
      0,
    );

    return Math.round(total / completedAssessments.length);
  }, [completedAssessments]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={completedAssessments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <AssessmentCard assessment={item} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            <Text style={styles.eyebrow}>VANI.COACH</Text>
            <Text style={styles.title}>Your progress</Text>
            <Text style={styles.subtitle}>
              Review your performance and keep improving.
            </Text>

            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>AVERAGE SCORE</Text>
              <Text style={styles.averageScore}>
                {averageScore}
                <Text style={styles.outOf}> / 100</Text>
              </Text>
              <Text style={styles.summaryFootnote}>
                Across {completedAssessments.length} completed assessments
              </Text>
            </View>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Assessment results</Text>
              <Text style={styles.count}>
                {completedAssessments.length} completed
              </Text>
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>Nothing here yet</Text>
            <Text style={styles.emptyText}>
              Complete your first assessment to see your score and personalized
              feedback here.
            </Text>
          </View>
        }
        ListFooterComponent={
          <Text style={styles.footer}>
            Every assessment is a chance to improve.
          </Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F6FA",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
  },
  eyebrow: {
    color: "#6C63E8",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 2,
    marginBottom: 8,
  },
  title: {
    color: "#20213A",
    fontSize: 30,
    fontWeight: "800",
    letterSpacing: -0.8,
  },
  subtitle: {
    color: "#77798C",
    fontSize: 14,
    lineHeight: 21,
    marginTop: 7,
  },
  summaryCard: {
    backgroundColor: "#29274F",
    borderRadius: 22,
    padding: 22,
    marginTop: 24,
  },
  summaryLabel: {
    color: "#C9C6F7",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.5,
  },
  averageScore: {
    color: "#FFFFFF",
    fontSize: 42,
    fontWeight: "800",
    marginTop: 10,
  },
  outOf: {
    color: "#C9C6F7",
    fontSize: 17,
    fontWeight: "500",
  },
  summaryFootnote: {
    color: "#D0CFE6",
    fontSize: 12,
    marginTop: 4,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 30,
    marginBottom: 14,
    gap: 8,
  },
  sectionTitle: {
    color: "#20213A",
    fontSize: 19,
    fontWeight: "800",
    flexShrink: 1,
  },
  count: {
    color: "#77798C",
    fontSize: 11,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 17,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#ECECF3",
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
  },
  typeBadge: {
    backgroundColor: "#F0EFFF",
    borderRadius: 7,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  typeText: {
    color: "#5B52CB",
    fontSize: 11,
    fontWeight: "700",
  },
  statusBadge: {
    borderRadius: 7,
    paddingHorizontal: 9,
    paddingVertical: 6,
  },
  goodBadge: {
    backgroundColor: "#E5F7ED",
  },
  improvementBadge: {
    backgroundColor: "#FFF1E6",
  },
  statusText: {
    fontSize: 10,
    fontWeight: "800",
  },
  goodText: {
    color: "#187847",
  },
  improvementText: {
    color: "#B65B1C",
  },
  question: {
    color: "#25263E",
    fontSize: 16,
    lineHeight: 23,
    fontWeight: "700",
    marginTop: 16,
  },
  scoreRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 18,
    marginBottom: 9,
  },
  scoreLabel: {
    color: "#77798C",
    fontSize: 12,
  },
  score: {
    color: "#29274F",
    fontSize: 16,
    fontWeight: "800",
  },
  progressTrack: {
    height: 6,
    borderRadius: 5,
    backgroundColor: "#EEEFF5",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 5,
  },
  goodFill: {
    backgroundColor: "#31AD76",
  },
  improvementFill: {
    backgroundColor: "#F0A05B",
  },
  feedbackBox: {
    backgroundColor: "#F8F8FC",
    borderRadius: 12,
    padding: 13,
    marginTop: 17,
  },
  feedbackHeading: {
    color: "#77798C",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.2,
    marginBottom: 7,
  },
  feedback: {
    color: "#51536B",
    fontSize: 12,
    lineHeight: 19,
  },
  emptyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ECECF3",
  },
  emptyTitle: {
    color: "#25263E",
    fontSize: 18,
    fontWeight: "800",
  },
  emptyText: {
    color: "#77798C",
    textAlign: "center",
    lineHeight: 21,
    fontSize: 13,
    marginTop: 8,
  },
  footer: {
    color: "#999AAC",
    fontSize: 12,
    textAlign: "center",
    marginTop: 10,
  },
});
