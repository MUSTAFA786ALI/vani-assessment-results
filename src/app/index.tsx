import { memo, useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  Assessment,
  assessments,
  AssessmentStatus,
  GOOD_SCORE_THRESHOLD,
} from "../data/assessments";

type Filter = "All" | "Upcoming" | "Completed" | "Pending";
type Sort = "Recent" | "Highest score" | "Lowest score";

const FILTERS: Filter[] = ["All", "Upcoming", "Completed", "Pending"];

const STATUS_COLORS: Record<
  AssessmentStatus,
  { background: string; text: string }
> = {
  Completed: { background: "#E3F7EC", text: "#187847" },
  Pending: { background: "#FFF0DF", text: "#A65C19" },
  Upcoming: { background: "#EAEAFF", text: "#5750BD" },
};

const AssessmentCard = memo(({ item }: { item: Assessment }) => {
  const isCompleted = item.status === "Completed";
  const isGood = item.score !== undefined && item.score >= GOOD_SCORE_THRESHOLD;

  const statusStyle = STATUS_COLORS[item.status];

  return (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <View style={styles.typeBadge}>
          <Text style={styles.typeText}>{item.type}</Text>
        </View>

        <View
          style={[
            styles.statusBadge,
            { backgroundColor: statusStyle.background },
          ]}
        >
          <Text style={[styles.statusText, { color: statusStyle.text }]}>
            {item.status}
          </Text>
        </View>
      </View>

      <Text style={styles.question}>{item.question}</Text>

      {isCompleted && item.score !== undefined ? (
        <>
          <View style={styles.scoreRow}>
            <Text style={styles.mutedText}>Assessment score</Text>
            <Text style={styles.score}>
              {item.score}
              <Text style={styles.scoreOutOf}> / 100</Text>
            </Text>
          </View>

          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${Math.max(0, Math.min(100, item.score))}%`,
                  backgroundColor: isGood ? "#2FA875" : "#F0A05B",
                },
              ]}
            />
          </View>

          <View
            style={[
              styles.performanceBadge,
              {
                backgroundColor: isGood ? "#E3F7EC" : "#FFF0DF",
              },
            ]}
          >
            <Text
              style={{
                color: isGood ? "#187847" : "#A65C19",
                fontSize: 11,
                fontWeight: "700",
              }}
            >
              {isGood ? "Good performance" : "Needs improvement"}
            </Text>
          </View>

          <View style={styles.feedbackBox}>
            <Text style={styles.feedbackHeading}>FEEDBACK</Text>
            <Text style={styles.feedback}>
              {item.feedback || "Feedback is not available."}
            </Text>
          </View>
        </>
      ) : (
        <View style={styles.pendingInfo}>
          <Text style={styles.pendingTitle}>
            {item.status === "Pending"
              ? "Evaluation in progress"
              : "Ready when you are"}
          </Text>
          <Text style={styles.pendingDescription}>
            {item.status === "Pending"
              ? "Your score and feedback will appear once evaluation is complete."
              : `Scheduled for ${item.date}`}
          </Text>
        </View>
      )}
    </View>
  );
});

AssessmentCard.displayName = "AssessmentCard";

export default function HomeScreen() {
  const [filter, setFilter] = useState<Filter>("All");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<Sort>("Recent");

  const counts = useMemo(
    () => ({
      All: assessments.length,
      Upcoming: assessments.filter((item) => item.status === "Upcoming").length,
      Completed: assessments.filter((item) => item.status === "Completed")
        .length,
      Pending: assessments.filter((item) => item.status === "Pending").length,
    }),
    [],
  );

  const completed = useMemo(
    () =>
      assessments.filter(
        (item) => item.status === "Completed" && item.score !== undefined,
      ),
    [],
  );

  const averageScore = useMemo(() => {
    if (!completed.length) return 0;

    return Math.round(
      completed.reduce((sum, item) => sum + item.score!, 0) / completed.length,
    );
  }, [completed]);

  const visibleAssessments = useMemo(() => {
    const query = search.trim().toLowerCase();

    const filtered = assessments.filter((item) => {
      const matchesStatus = filter === "All" || item.status === filter;

      const matchesSearch = item.question.toLowerCase().includes(query);

      return matchesStatus && matchesSearch;
    });

    return [...filtered].sort((a, b) => {
      if (sort === "Highest score") {
        return (b.score ?? -1) - (a.score ?? -1);
      }

      if (sort === "Lowest score") {
        const scoreA = a.score ?? Infinity;
        const scoreB = b.score ?? Infinity;
        return scoreA - scoreB;
      }

      return b.date.localeCompare(a.date);
    });
  }, [filter, search, sort]);

  const header = (
    <View>
      <Text style={styles.eyebrow}>VANI.COACH</Text>
      <Text style={styles.title}>Your progress</Text>
      <Text style={styles.subtitle}>
        Small improvements. Stronger communication.
      </Text>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>AVERAGE SCORE</Text>
        <Text style={styles.averageScore}>
          {averageScore}
          <Text style={styles.outOf}> / 100</Text>
        </Text>

        <View style={styles.summaryDivider} />

        <View style={styles.metricRow}>
          <View style={styles.metric}>
            <Text style={styles.metricValue}>{completed.length}</Text>
            <Text style={styles.metricLabel}>Completed</Text>
          </View>

          <View style={styles.metric}>
            <Text style={styles.metricValue}>{counts.Pending}</Text>
            <Text style={styles.metricLabel}>In progress</Text>
          </View>

          <View style={styles.metric}>
            <Text style={styles.metricValue}>
              {Math.round((completed.length / assessments.length) * 100)}%
            </Text>
            <Text style={styles.metricLabel}>Completion</Text>
          </View>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Your assessments</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
        {FILTERS.map((item) => {
          const selected = filter === item;

          return (
            <Pressable
              key={item}
              onPress={() => setFilter(item)}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              style={[styles.filterChip, selected && styles.filterChipSelected]}
            >
              <Text
                style={[
                  styles.filterText,
                  selected && styles.filterTextSelected,
                ]}
              >
                {item}
              </Text>
              <View
                style={[
                  styles.countBadge,
                  selected && styles.countBadgeSelected,
                ]}
              >
                <Text
                  style={[
                    styles.countText,
                    selected && styles.countTextSelected,
                  ]}
                >
                  {counts[item]}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>

      <TextInput
        value={search}
        onChangeText={setSearch}
        placeholder="Search assessments..."
        placeholderTextColor="#9293A5"
        style={styles.searchInput}
        clearButtonMode="while-editing"
        accessibilityLabel="Search assessments"
      />

      <View style={styles.resultsHeader}>
        <Text style={styles.resultsCount}>
          {visibleAssessments.length} results
        </Text>

        <View style={styles.sortRow}>
          {(["Recent", "Highest score", "Lowest score"] as Sort[]).map(
            (option) => (
              <Pressable
                key={option}
                onPress={() => setSort(option)}
                accessibilityRole="button"
                accessibilityState={{ selected: sort === option }}
                style={[
                  styles.sortButton,
                  sort === option && styles.sortButtonSelected,
                ]}
              >
                <Text
                  style={[
                    styles.sortText,
                    sort === option && styles.sortTextSelected,
                  ]}
                >
                  {option === "Highest score"
                    ? "High"
                    : option === "Lowest score"
                      ? "Low"
                      : "Recent"}
                </Text>
              </Pressable>
            ),
          )}
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={visibleAssessments}
        renderItem={({ item }) => <AssessmentCard item={item} />}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={header}
        ListEmptyComponent={
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No assessments found</Text>
            <Text style={styles.emptyText}>
              Try another filter or search term.
            </Text>
            <Pressable
              onPress={() => {
                setFilter("All");
                setSearch("");
                setSort("Recent");
              }}
              style={styles.resetButton}
            >
              <Text style={styles.resetButtonText}>Reset filters</Text>
            </Pressable>
          </View>
        }
        ListFooterComponent={
          <Text style={styles.footer}>Keep learning. Keep improving.</Text>
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
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
    paddingTop: 16,
    paddingBottom: 32,
  },
  eyebrow: {
    color: "#6C63E8",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 2,
    marginBottom: 7,
  },
  title: {
    color: "#20213A",
    fontSize: 30,
    fontWeight: "800",
    letterSpacing: -0.8,
  },
  subtitle: {
    color: "#77798C",
    fontSize: 13,
    marginTop: 6,
  },
  summaryCard: {
    backgroundColor: "#29274F",
    borderRadius: 22,
    padding: 21,
    marginTop: 22,
    marginBottom: 28,
  },
  summaryLabel: {
    color: "#C9C6F7",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.5,
  },
  averageScore: {
    color: "#FFFFFF",
    fontSize: 40,
    fontWeight: "800",
    marginTop: 8,
  },
  outOf: {
    color: "#C9C6F7",
    fontSize: 16,
    fontWeight: "500",
  },
  summaryDivider: {
    height: 1,
    backgroundColor: "#48466F",
    marginVertical: 18,
  },
  metricRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  metric: {
    flex: 1,
  },
  metricValue: {
    color: "#FFFFFF",
    fontSize: 21,
    fontWeight: "800",
  },
  metricLabel: {
    color: "#C9C6F7",
    fontSize: 11,
    marginTop: 5,
  },
  sectionTitle: {
    color: "#20213A",
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 14,
  },
  filterRow: {
    gap: 8,
    paddingBottom: 14,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E7E7F0",
  },
  filterChipSelected: {
    backgroundColor: "#29274F",
    borderColor: "#29274F",
  },
  filterText: {
    color: "#67697E",
    fontSize: 12,
    fontWeight: "700",
  },
  filterTextSelected: {
    color: "#FFFFFF",
  },
  countBadge: {
    backgroundColor: "#F0F0F6",
    borderRadius: 7,
    minWidth: 20,
    paddingHorizontal: 5,
    paddingVertical: 3,
    alignItems: "center",
  },
  countBadgeSelected: {
    backgroundColor: "#494671",
  },
  countText: {
    color: "#65677B",
    fontSize: 10,
    fontWeight: "800",
  },
  countTextSelected: {
    color: "#FFFFFF",
  },
  searchInput: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 13,
    color: "#25263E",
    borderWidth: 1,
    borderColor: "#E7E7F0",
    marginBottom: 14,
  },
  resultsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 6,
    marginBottom: 13,
  },
  resultsCount: {
    color: "#77798C",
    fontSize: 12,
    fontWeight: "600",
  },
  sortRow: {
    flexDirection: "row",
    gap: 4,
  },
  sortButton: {
    paddingHorizontal: 8,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: "#EDEDF5",
  },
  sortButtonSelected: {
    backgroundColor: "#DEDCFF",
  },
  sortText: {
    color: "#77798C",
    fontSize: 10,
    fontWeight: "700",
  },
  sortTextSelected: {
    color: "#5149BD",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 17,
    marginBottom: 13,
    borderWidth: 1,
    borderColor: "#ECECF3",
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
  statusText: {
    fontSize: 10,
    fontWeight: "800",
  },
  question: {
    color: "#25263E",
    fontSize: 16,
    lineHeight: 23,
    fontWeight: "700",
    marginTop: 15,
  },
  scoreRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 18,
    marginBottom: 8,
  },
  mutedText: {
    color: "#77798C",
    fontSize: 12,
  },
  score: {
    color: "#29274F",
    fontSize: 16,
    fontWeight: "800",
  },
  scoreOutOf: {
    color: "#8C8DA0",
    fontSize: 11,
    fontWeight: "500",
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
  performanceBadge: {
    alignSelf: "flex-start",
    borderRadius: 7,
    paddingHorizontal: 9,
    paddingVertical: 6,
    marginTop: 11,
  },
  feedbackBox: {
    backgroundColor: "#F8F8FC",
    borderRadius: 12,
    padding: 13,
    marginTop: 15,
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
  pendingInfo: {
    backgroundColor: "#F8F8FC",
    borderRadius: 12,
    padding: 13,
    marginTop: 16,
  },
  pendingTitle: {
    color: "#393952",
    fontSize: 12,
    fontWeight: "800",
  },
  pendingDescription: {
    color: "#77798C",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 5,
  },
  emptyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 24,
    alignItems: "center",
  },
  emptyTitle: {
    color: "#25263E",
    fontSize: 17,
    fontWeight: "800",
  },
  emptyText: {
    color: "#77798C",
    fontSize: 13,
    textAlign: "center",
    marginTop: 8,
  },
  resetButton: {
    backgroundColor: "#29274F",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginTop: 16,
  },
  resetButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  footer: {
    color: "#999AAC",
    fontSize: 12,
    textAlign: "center",
    marginTop: 10,
  },
});
