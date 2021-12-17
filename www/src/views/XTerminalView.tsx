import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import moment from "moment";
import * as React from "react";
import { useParams } from "react-router-dom";
import { Header, Icon, Table, Button } from "semantic-ui-react";
import { XCredentialSummary } from "../components/credential";
import { XClipboard } from "../components/form";
import { XBoundary, XCardGroup } from "../components/layout";
import { XErrorMessage, XLoadingMessage } from "../components/messages";
import { XTargetHeader } from "../components/target";
import { XTerminalShell } from "../components/terminal";
import {
  XNoTasksFound,
  XTaskCard,
  XTaskCardDisplayType
} from "../components/task";
import { Target } from "../graphql/models";
import { useEffect } from "react";

export const TERMINAL_QUERY = gql`
  query Target($id: ID!) {
    target(id: $id) {
      id
      name
      primaryIP
      publicIP
      primaryMAC
      machineUUID
      hostname
      lastSeen
      tasks {
        id
        queueTime
        claimTime
        execStartTime
        execStopTime
        error
        job {
          id
          name
          staged
        }
      }
      tags {
        id
        name
      }
      credentials {
        id
        principal
        secret
        fails
      }
    }
  }
`;

type TerminalQueryResponse = {
  target: Target;
};

const XTerminalView = () => {
  let { id } = useParams();

  const {
    loading,
    error,
    data: {
      target: {
        name = "Untitled Target",
        primaryIP = null,
        publicIP = null,
        primaryMAC = null,
        hostname = null,
        machineUUID = null,
        lastSeen = null,
        tags = [],
        tasks = [],
        credentials = []
      } = {}
    } = {}
  } = useQuery<TerminalQueryResponse>(TERMINAL_QUERY, {
    variables: { id },
    pollInterval: 5000
  });

  const whenLoading = (
    <XLoadingMessage title="Loading Terminal" msg="Fetching target info" />
  );
  const whenFieldEmpty = <span>Unknown</span>;
  const whenNotSeen = <span>Never</span>;
  const whenTasksEmpty = <XNoTasksFound />;

  return (
    <React.Fragment>
      <XTargetHeader name={name} tags={tags} lastSeen={lastSeen} />

      <XErrorMessage title="Error Loading Target" err={error} />
      <XBoundary boundary={whenLoading} show={!loading}>
        {hostname && (<XTerminalShell t={hostname}></XTerminalShell>)}
      </XBoundary>
    </React.Fragment>
  );
};

export default XTerminalView;
