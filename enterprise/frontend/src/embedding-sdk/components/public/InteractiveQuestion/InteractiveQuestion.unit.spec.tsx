import { within } from "@testing-library/react";

import {
  setupAlertsEndpoints,
  setupCardEndpoints,
  setupCardQueryEndpoints,
  setupCardQueryMetadataEndpoint,
  setupDatabaseEndpoints,
  setupTableEndpoints,
  setupUnauthorizedCardEndpoints,
} from "__support__/server-mocks";
import {
  act,
  renderWithProviders,
  screen,
  waitForLoaderToBeRemoved,
} from "__support__/ui";
import { InteractiveQuestionResult } from "embedding-sdk/components/private/InteractiveQuestionResult";
import { createMockAuthProviderUriConfig } from "embedding-sdk/test/mocks/config";
import { setupSdkState } from "embedding-sdk/test/server-mocks/sdk-init";
import {
  createMockCard,
  createMockCardQueryMetadata,
  createMockColumn,
  createMockDatabase,
  createMockDataset,
  createMockDatasetData,
  createMockTable,
  createMockUser,
} from "metabase-types/api/mocks";

import { useInteractiveQuestionContext } from "../../private/InteractiveQuestion/context";

import { InteractiveQuestion } from "./InteractiveQuestion";

const TEST_USER = createMockUser();
const TEST_DB_ID = 1;
const TEST_DB = createMockDatabase({ id: TEST_DB_ID });

const TEST_TABLE_ID = 1;
const TEST_TABLE = createMockTable({ id: TEST_TABLE_ID, db_id: TEST_DB_ID });

const TEST_COLUMN = createMockColumn({
  display_name: "Test Column",
  name: "Test Column",
});

const TEST_DATASET = createMockDataset({
  data: createMockDatasetData({
    cols: [TEST_COLUMN],
    rows: [["Test Row"]],
  }),
});

// Provides a button to re-run the query
function InteractiveQuestionTestResult() {
  const { resetQuestion } = useInteractiveQuestionContext();

  return (
    <div>
      <button onClick={resetQuestion}>Run Query</button>
      <InteractiveQuestionResult withTitle />
    </div>
  );
}

const setup = ({
  isValidCard = true,
}: {
  isValidCard?: boolean;
} = {}) => {
  const { state } = setupSdkState({
    currentUser: TEST_USER,
  });

  const TEST_CARD = createMockCard();
  if (isValidCard) {
    setupCardEndpoints(TEST_CARD);
    setupCardQueryMetadataEndpoint(
      TEST_CARD,
      createMockCardQueryMetadata({
        databases: [TEST_DB],
      }),
    );
  } else {
    setupUnauthorizedCardEndpoints(TEST_CARD);
  }
  setupAlertsEndpoints(TEST_CARD, []);
  setupDatabaseEndpoints(TEST_DB);

  setupTableEndpoints(TEST_TABLE);

  setupCardQueryEndpoints(TEST_CARD, TEST_DATASET);

  return renderWithProviders(
    <InteractiveQuestion questionId={TEST_CARD.id}>
      <InteractiveQuestionTestResult />
    </InteractiveQuestion>,
    {
      mode: "sdk",
      sdkProviderProps: {
        config: createMockAuthProviderUriConfig({
          authProviderUri: "http://TEST_URI/sso/metabase",
        }),
      },
      storeInitialState: state,
    },
  );
};

describe("InteractiveQuestion", () => {
  it("should initially render with a loader", async () => {
    setup();

    expect(screen.getByTestId("loading-indicator")).toBeInTheDocument();
  });

  it("should render loading state when rerunning the query", async () => {
    setup();

    await waitForLoaderToBeRemoved();

    expect(
      await within(screen.getByTestId("TableInteractive-root")).findByText(
        TEST_COLUMN.display_name,
      ),
    ).toBeInTheDocument();
    expect(
      await within(screen.getByRole("gridcell")).findByText("Test Row"),
    ).toBeInTheDocument();

    expect(screen.queryByTestId("loading-indicator")).not.toBeInTheDocument();

    // Simulate drilling down by re-running the query again
    act(() => screen.getByText("Run Query").click());

    expect(screen.queryByText("Question not found")).not.toBeInTheDocument();
    expect(screen.getByTestId("loading-indicator")).toBeInTheDocument();
    expect(
      within(await screen.findByRole("gridcell")).getByText("Test Row"),
    ).toBeInTheDocument();
  });

  it("should render when question is valid", async () => {
    setup();

    await waitForLoaderToBeRemoved();

    expect(
      within(screen.getByTestId("TableInteractive-root")).getByText(
        TEST_COLUMN.display_name,
      ),
    ).toBeInTheDocument();
    expect(
      within(screen.getByRole("gridcell")).getByText("Test Row"),
    ).toBeInTheDocument();
  });

  it("should not render an error if a question isn't found before the question loaded", async () => {
    setup();

    await waitForLoaderToBeRemoved();

    expect(screen.queryByText("Error")).not.toBeInTheDocument();
    expect(screen.queryByText("Question not found")).not.toBeInTheDocument();
  });

  it("should render an error if a question isn't found", async () => {
    setup({ isValidCard: false });

    await waitForLoaderToBeRemoved();

    expect(screen.getByText("Error")).toBeInTheDocument();
    expect(screen.getByText("Question not found")).toBeInTheDocument();
  });
});
