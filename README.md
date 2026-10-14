# Vani.Coach — Assessment Results

A React Native assessment results screen built with Expo and TypeScript as part of a frontend engineering assessment.

## Features

- Displays completed assessment results.
- Distinguishes Recorded and Text assessments.
- Shows scores and AI-generated feedback.
- Classifies performance using a configurable score threshold.
- Provides an empty state when no completed results are available.
- Uses `FlatList` for list rendering.

## Tech Stack

- React Native
- Expo
- TypeScript
- Expo Router

## Getting Started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npx expo start
```

## Implementation Notes

Assessment data is represented using TypeScript types and sample data. Pending assessments are excluded from the completed results. The current performance threshold is 70/100.

## Future Improvements

- Connect to a backend assessment API.
- Add automated tests for score classification and empty states.
- Add loading and error states for remote data.
