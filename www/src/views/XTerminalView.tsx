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
import {WebsocketBuilder} from 'websocket-ts';


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

  const ws = new WebsocketBuilder('ws://localhost:9050/cmd')
    .onOpen((i, ev) => { console.log("opened") })
    .onClose((i, ev) => { console.log("closed") })
    .onError((i, ev) => { console.log("error") })
    .onMessage((i, ev) => { handleCommandOutput(ev) })
    .onRetry((i, ev) => { console.log("retry") })
    .build();

  const formJsonMsg = (command) =>  {
    var obj = {
      Uuid: id, 
      Data: command.trim(), 
      MsgType: 1,
      SrcType: 1
    }
    return JSON.stringify(obj)
  }

  const handleCommandInput = (command) => {
    var jsonMsg = formJsonMsg(command);
    console.log(jsonMsg);
    ws.send(jsonMsg.trim());
    setCommandOutput("");

  }

  const [commandOutput, setCommandOutput] = React.useState("");
  
  const handleCommandOutput = (response) => {
    // console.log(response.data)
    let jsonObj: any = JSON.parse(response.data);
    // console.log(jsonObj.Data)
    setCommandOutput(jsonObj.Data);
  }


  return (
    <React.Fragment>
      <XTargetHeader name={name} tags={tags} lastSeen={lastSeen} />

      <XErrorMessage title="Error Loading Target" err={error} />
      <XBoundary boundary={whenLoading} show={!loading}>
        {hostname && (<XTerminalShell t={hostname} handleCallback={handleCommandInput} commandOutput={commandOutput}></XTerminalShell>)}
      </XBoundary>
    </React.Fragment>
  );
};

export default XTerminalView;
